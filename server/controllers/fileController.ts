import fileService from '../services/fileService';
import File from '../models/File';
import { Request, Response } from 'express';
import User from '../models/User';
import fs from 'fs';

// Extend express Request interface to include user property
declare global {
	namespace Express {
		interface Request {
			user?: any;
			files?: any;
		}
	}
}

class FileController {
	async createDir(req: Request, res: Response) {
		try {
			const { name, type, parentId } = req.body;
			const file = new File({
				name,
				type,
				parentId,
				userId: req.user.id,
			});
			const parentFile = await File.findOne({ _id: parentId });

			if (!parentFile) {
				file.path = name;
				await fileService.createDir(file);
			} else {
				file.path = `${parentFile.path}\\${file.name}`;
				await fileService.createDir(file);

				parentFile.childIds.push(file._id);
				await parentFile.save();
			}

			await file.save();
			return res.json(file);
		} catch (error) {
			console.log(error);
			return res.status(400).json(error);
		}
	}

	async getFiles(req: Request, res: Response) {
		try {
			const { sort } = req.query;
			const commonQuery = {
				userId: req.user.id,
				parentId: req.query.parent,
			};

			let sortQuery = {};
			if (sort === 'name' || sort === 'type' || sort === 'date') {
				sortQuery = { [sort]: 1 };
			}

			const files = await File.find(commonQuery).sort(sortQuery);

			return res.json(files);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Can not get files' });
		}
	}

	async uploadFile(req: Request, res: Response) {
		try {
			const file = req.files.file;

			const parent = await File.findOne({
				userId: req.user.id,
				_id: req.body.parent,
			});

			const user = await User.findOne({ _id: req.user.id });

			if (user?.usedSpace + file.size > (user?.diskSpace as number)) {
				return res
					.status(400)
					.json({ message: 'There is no space on disk' });
			}

			user!.usedSpace = user?.usedSpace + file.size;

			let path: string;
			if (parent) {
				path = `${process.env.FILE_PATH}\\${user!._id}\\${
					parent.path
				}\\${file.name}`;
			} else {
				path = `${process.env.FILE_PATH}\\${user!._id}\\${file.name}`;
			}

			if (fs.existsSync(path)) {
				return res.status(400).json({ message: 'File already exist' });
			}
			file.mv(path);

			const type = file.name.split('.').pop();
			let filePath = file.name;

			if (parent) {
				filePath = `${parent.path}\\ ${file.name}`;
			}

			const dbFile = new File({
				name: file.name,
				type,
				size: file.size,
				path: filePath,
				parentId: parent?._id,
				userId: user?._id,
			});

			await dbFile.save();
			await user?.save();

			res.json(dbFile);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'File can not be upload' });
		}
	}

	async downloadFile(req: Request, res: Response) {
		try {
			const file = await File.findOne({
				_id: req.query.id,
				userId: req.user.id,
			});

			const path = fileService.getPath(file);

			if (fs.existsSync(path)) {
				return res.download(path, file?.name as string);
			}

			return res.status(400).json({ message: 'Download error' });
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ message: 'File can not be download' });
		}
	}

	async deleteFile(req: Request, res: Response) {
		try {
			const file = await File.findOne({
				_id: req.query.id,
				userId: req.user.id,
			});

			if (!file) {
				return res.status(400).json({ message: 'File not found' });
			}

			fileService.deleteFile(file);

			await file.deleteOne();
			return res.json({ message: 'File was deleted' });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: 'File can not be deleted' });
		}
	}

	async searchFile(req: Request, res: Response) {
		try {
			const searchName = req.query.search;
			let files = await File.find({ userId: req.user.id });

			files = files.filter((file) =>
				(file.name as string)
					.toLowerCase()
					.includes(searchName as string)
			);

			return res.json(files);
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: 'Search error' });
		}
	}
}

export default new FileController();

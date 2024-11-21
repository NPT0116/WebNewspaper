import { ISectionBranch, ISectionTree } from '~/interfaces/Section/sectionInterface.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { AppError } from '~/utils/appError.js';
import { NextFunction, Request, Response } from 'express';
import { error } from 'console';

export const getSectionTree: () => Promise<ISectionTree | null> = async () => {
  try {
    // Lấy các section cấp cao nhất
    const section = await Section.find({ parentSection: null }).populate({
      path: 'childSections',
      populate: {
        path: 'childSections', // Populate cấp con của con
        populate: {
          path: 'childSections' // Tiếp tục nếu có thêm cấp sâu hơn
        }
      }
    });

    // Hàm xây dựng cây phân cấp
    const buildSectionTree = (section: any): ISectionBranch => ({
      id: section._id.toString(),
      name: section.name,
      slug: section.slug,
      childSections: section.childSections.map(buildSectionTree) // Đệ quy
    });

    // Tạo cây section
    const response: ISectionTree = section.map(buildSectionTree);

    return response; // Trả về cây section
  } catch (err) {
    console.error('Error building section tree:', err);
    return null; // Trả về null nếu có lỗi
  }
};

export const getSectionsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sectionList = await Section.find({});
    if (!sectionList.length) {
      next(new AppError("can't get sectionList ", 500));
      return;
    }
    res.status(200).json({
      status: 'success',
      data: sectionList.map((section) => ({
        id: section._id,
        name: section.name
      }))
    });
  } catch (e) {
    console.log(e);

    next(new AppError("Can't get section in list", 500));
  }
};

import mongoose from 'mongoose';
import { Comment } from '~/models/Comment/commentSchema.js'; // Đường dẫn tới Comment schema
import { Article } from '~/models/Article/articleSchema.js'; // Đường dẫn tới Article schema
import { Account } from '~/models/Account/accountSchema.js'; // Đường dẫn tới Account schema
import bcrypt from 'bcrypt';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';

export const seedComments = async () => {
  try {
    // Xóa dữ liệu cũ
    await Comment.deleteMany({});
    await Account.deleteMany({ role: 'reader' });
    console.log('Old comments and reader accounts cleared.');

    // Tạo tài khoản Reader
    const readerAccounts = [];
    for (let i = 1; i <= 6; i++) {
      const readerAccount = new Account({
        email: `reader${i}@example.com`,
        role: 'reader',
        profileType: 'ReaderProfile',
        localAuth: {
          username: `reader${i}`,
          password: await bcrypt.hash('123', 10) // Mật khẩu mặc định "123"
        }
      });
      const savedReaderAccount = await readerAccount.save();
      readerAccounts.push(savedReaderAccount);
    }

    // Create profiles for accounts
    for (let i = 1; i <= 6; i++) {
      const readerProfile = new ReaderProfile({
        accountId: readerAccounts[i - 1]._id,
        name: `Reader User ${i}`,
        dob: new Date(`198${i}-0${i}-15`),
        gender: i % 2 === 0 ? 'male' : 'female'
      });
      const savedReaderProfile = await readerProfile.save();
      readerAccounts[i - 1].profileId = savedReaderProfile._id as mongoose.Types.ObjectId;
      await readerAccounts[i - 1].save();
    }

    // Lấy tất cả bài viết
    const articles = await Article.find({});
    if (!articles.length) {
      console.error('No articles found. Please seed articles first.');
      return;
    }

    // Kiểm tra số lượng bài viết để tránh lỗi
    const articlesToComment = Math.min(articles.length, 4); // Chỉ lấy 4 bài đầu tiên nếu có

    // Dữ liệu comment
    const comments = [
      {
        article: articles[0]?._id, // Bình luận lên bài viết đầu tiên
        account: readerAccounts[0]._id,
        content: 'This article is insightful and very well-written.'
      },
      {
        article: articles[0]?._id,
        account: readerAccounts[1]._id,
        content: 'I totally agree with the points raised in this article.'
      },
      {
        article: articles[1]?._id, // Bình luận lên bài viết thứ hai
        account: readerAccounts[2]._id,
        content: 'Interesting perspective, but I think it could use more details.'
      },
      {
        article: articles[2]?._id, // Bình luận lên bài viết thứ ba
        account: readerAccounts[3]._id,
        content: 'A great read. Thanks for sharing!'
      },
      {
        article: articles[3]?._id, // Bình luận lên bài viết cuối cùng
        account: readerAccounts[4]._id,
        content: 'Amazing coverage of the Cleveland Cavaliers!'
      },
      {
        article: articles[3]?._id, // Bình luận thêm vào bài viết cuối cùng
        account: readerAccounts[5]._id,
        content: 'Go Cavs! This season is looking great.'
      }
    ];

    // Lọc comment để tránh lỗi với các bài viết không tồn tại
    const filteredComments = comments.filter((comment) => comment.article && comment.account);

    // Chèn comment vào database
    const insertedComments = await Comment.insertMany(filteredComments);

    console.log('Comments seeded successfully:', insertedComments);
  } catch (err) {
    console.error('Error seeding comments:', err);
  }
};

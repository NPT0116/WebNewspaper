// models/index.ts
import './Profile/reporterProfile.js';
import './Profile/readerProfile.js';
import './Profile/adminProfile.js';
import './Profile/editorProfile.js';

import './Account/accountSchema.js';
import './Article/articleSchema.js';
import './Section/sectionSchema.js';
import './Tag/tagSchema.js';
import './Comment/commentSchema.js';
// No export needed; importing the files ensures the models are registered

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  SelectAll,
  ShowBlocks,
  SimpleUploadAdapter,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Title,
  TodoList,
  Underline,
  Undo
} from 'ckeditor5';

const editorConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'sourceEditing',
      'showBlocks',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'link',
      'insertImage',
      'insertTable',
      'highlight',
      'blockQuote',
      'codeBlock',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'outdent',
      'indent'
    ],
    shouldNotGroupWhenFull: false
  },
  plugins: [
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Markdown,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromMarkdownExperimental,
    PasteFromOffice,
    SelectAll,
    ShowBlocks,
    SimpleUploadAdapter,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    Undo
  ],
  balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
  heading: {
    options: [
      {
        model: 'paragraph',
        title: 'Paragraph',
        class: 'ck-heading_paragraph'
      },
      {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'ck-heading_heading1'
      },
      {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'ck-heading_heading2'
      },
      {
        model: 'heading3',
        view: 'h3',
        title: 'Heading 3',
        class: 'ck-heading_heading3'
      },
      {
        model: 'heading4',
        view: 'h4',
        title: 'Heading 4',
        class: 'ck-heading_heading4'
      },
      {
        model: 'heading5',
        view: 'h5',
        title: 'Heading 5',
        class: 'ck-heading_heading5'
      },
      {
        model: 'heading6',
        view: 'h6',
        title: 'Heading 6',
        class: 'ck-heading_heading6'
      }
    ]
  },
  htmlSupport: {
    allow: [
      {
        name: /^.*$/,
        styles: true,
        attributes: true,
        classes: true
      }
    ]
  },
  image: {
    toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage']
  },

  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
    decorators: {
      toggleDownloadable: {
        mode: 'manual',
        label: 'Downloadable',
        attributes: {
          download: 'file'
        }
      }
    }
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },
  mention: {
    feeds: [
      {
        marker: '@',
        feed: [
          /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
        ]
      }
    ]
  },
  menuBar: {
    isVisible: true
  },
  placeholder: 'Type or paste your content here!',
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
  },
  simpleUpload: {
    uploadUrl: '/api/upload-image'
  },
  shadowRoot: {
    mode: 'open'
  }
};

export let editorInstance;

ClassicEditor.create(document.querySelector('#editor'), editorConfig)
  .then((editor) => {
    editorInstance = editor; // Store the editor instance for later use

    const form = document.querySelector('#editor-form');
    form.addEventListener('submit', (event) => {
      // Set the value of the hidden input to the CKEditor content
      const editorContent = editor.getData();
      document.querySelector('#editor-content').value = editorContent;
    });
  })
  .catch((error) => {
    console.error('Error initializing CKEditor:', error);
  });
const uploadInput = document.getElementById('upload');
const filenameLabel = document.getElementById('filename');
const imagePreview = document.getElementById('image-preview');

// Check if the event listener has been added before
let isEventListenerAdded = false;

let imageUrl = '';

const layout = document.getElementById('layout');
console.log(layout.value);
const layoutPreview = document.getElementById('layout-preview');
const getPreviewInfo = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('desc').value;
  const theme = document.getElementById('theme').value;
  return { title, description, theme };
};

const theme = document.getElementById('theme');
theme.addEventListener('change', (e) => {
  renderPreviewLayout(layout.value);
});
const renderPreviewLayout = (layout) => {
  const { title, description, theme } = getPreviewInfo();
  const backgroundString = `background-color: ${theme === 'light' ? 'white' : 'black'}`;
  const textColorString = `color: ${theme === 'dark' ? 'white' : 'black'}`;
  if (imageUrl) {
    if (layout === 'text-right') {
      layoutPreview.innerHTML = `
        <div style="display: flex; align-items: center; ${backgroundString}">
          <div  style="width:50%; display: flex; justify-content: center"><img src="${imageUrl}" style="max-height: 150px; max-width: 50%; margin-right: 16px;" alt="Uploaded Image" /></div>
           <div style="width:50%;display: flex; justify-content:center">
              <div style="max-width: 50%; ${textColorString}">
                <h2 style="text-align:center"  id="preview-title">${title}</h2>
                <div style="font-style:italic; font-weight:300; text-align: center" id="preview-description">${description}</div>
                <div style="text-align:center" id="preview-author">By Nguyen Hong Quan</div>
                <div style="text-align:center" id="preview-date">19/11/2024</div>
              </div>
          </div>
        </div>`;
    } else if (layout === 'text-left') {
      layoutPreview.innerHTML = `
        <div style="display: flex; align-items: center; ${backgroundString}">
          <div style="width:50%; display:flex; justify-content: center">
              <div style="max-width: 50%; ${textColorString}">
                <h2 style="text-align:center" id="preview-title">${title}</h2>
                <div style="font-style:italic; font-weight:300; text-align: center" id="preview-description">${description}</div>
                <div style="text-align:center" id="preview-author">By Nguyen Hong Quan</div>
                <div style="text-align:center" id="preview-date">19/11/2024</div>
              </div>
          </div>
          <div style="width:50%; display: flex; justify-content: center"><img src="${imageUrl}" style="max-height: 150px; max-width: 50%; margin-left: 16px;" alt="Uploaded Image" /></div>
        </div>`;
    } else {
      layoutPreview.innerHTML = `
        <div style="text-align: center;">
          <img src="${imageUrl}" style="max-height: 150px; margin: auto;" alt="Uploaded Image" />
          <p>This is the content with the image centered.</p>
        </div>`;
    }
  } else {
    layoutPreview.innerHTML = `<p style="text-align: center;">No image uploaded yet.</p>`;
  }
};

let serverImageUrl = '';
// uploadInput.addEventListener('change', async (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     filenameLabel.textContent = file.name;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       imagePreview.innerHTML = `<img src="${e.target.result}" style="max-height:192px; max-width:100%; margin-left:auto; margin-right:auto" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
//       imagePreview.classList.remove('border-dashed', 'border-2', 'border-gray-400');
//       imageUrl = e.target.result;
//       // Add event listener for image preview only once
//       if (!isEventListenerAdded) {
//         imagePreview.addEventListener('click', () => {
//           uploadInput.click();
//         });

//         isEventListenerAdded = true;
//       }
//       console.log(layout.value);
//       renderPreviewLayout(layout.value);
//     };
//     try {
//       const formData = new FormData();
//       formData.append('upload', file);

//       const response = await fetch('/api/upload-image', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload image');
//       }

//       const result = await response.json();
//       serverImageUrl = result.url; // Assuming server returns { url: 'image_url' }

//       console.log('Image uploaded successfully:', serverImageUrl);

//       // Optionally update the preview with the server URL
//       imagePreview.innerHTML = `<img src="${serverImageUrl}" style="max-height:192px; max-width:100%; margin-left:auto; margin-right:auto" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }

//     reader.readAsDataURL(file);
//   } else {
//     filenameLabel.textContent = '';
//     imagePreview.innerHTML = `<div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">No image preview</div>`;
//     imagePreview.classList.add('border-dashed', 'border-2', 'border-gray-400');

//     // Remove the event listener when there's no image
//     imagePreview.removeEventListener('click', () => {
//       uploadInput.click();
//     });

//     isEventListenerAdded = false;
//   }
// });

layout.addEventListener('change', (e) => {
  const layout = e.target.value;
  renderPreviewLayout(layout);
});

const title = document.getElementById('title');
title?.addEventListener('input', (e) => {
  const previewTitle = document.getElementById('preview-title');
  if (previewTitle !== null) previewTitle.textContent = e.target.value;
});

const description = document.getElementById('desc');
description?.addEventListener('input', (e) => {
  const previewDescription = document.getElementById('preview-description');
  if (previewDescription !== null) previewDescription.textContent = e.target.value;
});

// const searchInput = document.getElementById('searchInput');
// const dropdown = document.getElementById('dropdown');

// let debounceTimeout;

// // Debounce function to delay search
// function debounce(func, delay) {
//   return function (...args) {
//     clearTimeout(debounceTimeout);
//     debounceTimeout = setTimeout(() => func(...args), delay);
//   };
// }

// let results;

// // Simulate search API request
// async function fetchSearchResults(query) {
//   dropdown.classList.remove('hidden'); // Show dropdown
//   dropdown.innerHTML = `
// <div role="status" class="flex justify-center p-4">
//     <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
//         <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
//     </svg>

// </div>
// `; // Show loading text

//   try {
//     // Simulate server delay
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     console.log(query);
//     const params = new URLSearchParams({
//       search_value: query
//     });
//     const response = await fetch(`/api/tags?search_value=${query}`);
//     const jsonResponse = await response.json();
//     results = jsonResponse.data.tags;
//     console.log(results);

//     renderDropdown(results);
//   } catch (error) {
//     console.error('Search error:', error);
//     dropdown.innerHTML = '<div class="text-center text-gray-500 py-2 z-10">Error loading results</div>';
//   }
// }

// let tags = [];

// function addTag(tag) {
//   if (!tags.some((_tag) => _tag._id === tag._id)) {
//     tags.push(tag);
//     updateTags();
//   }
// }

// function removeTag(tag) {
//   tags = tags.filter((_tag) => _tag._id !== tag._id);
//   updateTags();
// }

// // Update the input field with selected tags
// function updateTags() {
//   const tagContainer = document.getElementById('tagContainer');
//   const tagWrappers = document.getElementsByClassName('tag-wrapper');
//   const tagsInput = document.getElementById('tags');
//   Array.from(tagWrappers).forEach((wrapper) => tagContainer.removeChild(wrapper));
//   tags.forEach((tag) => {
//     console.log(tag);
//     const ele = document.createElement('span');
//     ele.classList.add('tag-wrapper');
//     ele.innerHTML = `<span class="rounded-md bg-gray-300 text-black px-2 py-1 flex gap-2">${tag.name}
//     <div class="cursor-pointer tag" data='${JSON.stringify(tag)}'>x</div>
//     </span>`;
//     // Insert at the beginning of the container
//     tagContainer.insertBefore(ele, tagContainer.firstChild);
//     tagsInput.value = tags.map((tag) => tag._id.toString()).join(',');

//     console.log(tagsInput.value);
//   });
//   const tagElements = document.getElementsByClassName('tag');
//   Array.from(tagElements).forEach((tag) => {
//     tag.addEventListener('click', (e) => {
//       const data = e.currentTarget.getAttribute('data');
//       console.log(data);
//       removeTag(JSON.parse(data)); // Call the function to remove the tag
//     });
//   });
//   renderDropdown(results);
// }

// // Render dropdown with search results
// function renderDropdown(results) {
//   if (!results.length) {
//     dropdown.innerHTML = '<div class="text-center text-gray-500 py-2 z-10">No results found</div>';
//   } else {
//     const resultItems = results
//       .map((result) => {
//         console.log(result);
//         if (!tags.some((tag) => tag._id === result._id)) return `<div data-result='${JSON.stringify(result)}' class="px-4 py-2 hover:bg-gray-100 cursor-pointer z-10">${result.name}</div>`;
//         return `<div data-result='${JSON.stringify(result)}' class="px-4 py-2 bg-blue-200 hover:bg-blue-300 cursor-pointer z-10">${result.name}</div>`;
//       })
//       .join('');
//     dropdown.innerHTML = resultItems;
//     const dropdownItems = dropdown.querySelectorAll('[data-result]');
//     dropdownItems.forEach((item) => {
//       item.addEventListener('click', (e) => {
//         const result = JSON.parse(e.currentTarget.getAttribute('data-result'));
//         if (!tags.some((tag) => tag._id === result._id)) addTag(result);
//         else removeTag(result);
//       });
//     });
//   }
// }

// // Listen to input events with debounce
// searchInput.addEventListener(
//   'input',
//   debounce((event) => {
//     const query = event.target.value.trim();

//     if (query.length) {
//       fetchSearchResults(query);
//     } else {
//       dropdown.classList.add('hidden');
//     }
//   }, 500) // Adjust debounce delay here
// );
// searchInput.addEventListener('focus', () => {
//   dropdown.classList.remove('hidden');
//   // positionDropdown();
// });
// document.getElementById('tagContainer').addEventListener('click', () => searchInput.focus());
// document.addEventListener('click', (e) => {
//   if (!e.target.closest('.relative')) {
//     dropdown.classList.add('hidden');
//   }
// });

const sectionSelect = document.getElementById('section');

// const sections = (await (await fetch('/api/sections')).json()).sections;
// sections.forEach((section) => {
//   const option = document.createElement('option');
//   option.value = section._id;
//   option.textContent = section.name;
//   sectionSelect.appendChild(option);
// });

const handleSubmit = async () => {
  const title = document.getElementById('title')?.value;
  const description = document.getElementById('desc')?.value;
  const layout = document.getElementById('layout')?.value;
  const theme = document.getElementById('theme')?.value;
  const images = [serverImageUrl];
  const content = editorInstance.getData();
  const section = sectionSelect.value;
  console.log({ title, description, layout, theme, images, content, section });
  try {
    const res = await fetch('/api/articles/673d5607e42ae42bd084fb0d/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, layout, bannerTheme: theme, images, content, sectionId: section, authorId: '673d5607e42ae42bd084fb02', tags: tags.map((tag) => tag._id) })
    });
    console.log(await res.json());
  } catch (error) {
    console.log(error);
  }
};

const saveBtn = document.getElementById('save-button');
saveBtn?.addEventListener('click', handleSubmit);

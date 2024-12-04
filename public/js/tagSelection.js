class TagSelector {
  constructor(containerSelector, dropdownSelector, searchInputSelector, tags) {
    console.log('Tag selector is initialized');
    this.container = document.getElementById(containerSelector);
    this.selectedTags = [];
    this.allTags = tags ?? [];
    this.renderTags = tags ?? [];
    this.dropdown = document.getElementById(dropdownSelector);
    this.searchInput = document.getElementById(searchInputSelector);

    this.searchInput.addEventListener(
      'input',
      (event) => {
        const searchTerm = event.target.value;
        const regex = new RegExp(searchTerm, 'i');

        // Filter `allTags` using the regex and update `renderTags`
        if (searchTerm == '') this.renderTags = this.allTags;
        else this.renderTags = this.allTags.filter((tag) => regex.test(tag.name));
        this.renderDropdown(this.renderTags);
      }
      // Adjust debounce delay here
    );
    this.searchInput.addEventListener('focus', () => {
      this.dropdown.classList.remove('hidden');
      // positionDropdown();
    });
    document.getElementById('tagContainer').addEventListener('click', () => this.searchInput.focus());
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.dropdown.classList.add('hidden');
      }
    });
  }

  addTag(tag) {
    if (!this.selectedTags.some((_tag) => _tag._id === tag._id)) {
      this.selectedTags.push(tag);
      this.updateTags();
    }
  }

  removeTag(tag) {
    this.selectedTags = this.selectedTags.filter((_tag) => _tag._id !== tag._id);
    this.updateTags();
  }

  updateTags() {
    const tagWrappers = document.getElementsByClassName('tag-wrapper');
    Array.from(tagWrappers).forEach((wrapper) => this.container.removeChild(wrapper));
    this.selectedTags.forEach((tag) => {
      console.log(tag);
      const ele = document.createElement('span');
      ele.classList.add('tag-wrapper');
      ele.innerHTML = `<span class="rounded-md bg-gray-300 text-black px-2 py-1 flex gap-2">${tag.name} 
      <div class="cursor-pointer tag" data='${JSON.stringify(tag)}'>x</div>
      </span>`;
      // Insert at the beginning of the container
      this.container.insertBefore(ele, this.container.firstChild);
    });
    const tagElements = document.getElementsByClassName('tag');
    Array.from(tagElements).forEach((tag) => {
      tag.addEventListener('click', (e) => {
        const data = e.currentTarget.getAttribute('data');
        console.log(data);
        this.removeTag(JSON.parse(data)); // Call the function to remove the tag
      });
    });
    this.renderDropdown(this.renderTags);
  }

  renderDropdown(results) {
    if (!results.length) {
      this.dropdown.innerHTML = '<div class="text-center text-gray-500 py-2 z-10">No results found</div>';
    } else {
      const resultItems = results
        .map((result) => {
          console.log(result);
          if (!this.selectedTags.some((tag) => tag._id === result._id))
            return `<div data-result='${JSON.stringify(result)}' class="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer z-10">${result.name}</div>`;
          return `<div data-result='${JSON.stringify(result)}' class="px-4 py-2 text-black bg-blue-200 hover:bg-blue-300 cursor-pointer z-10">${result.name}</div>`;
        })
        .join('');
      this.dropdown.innerHTML = resultItems;
      const dropdownItems = this.dropdown.querySelectorAll('[data-result]');
      dropdownItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          const result = JSON.parse(e.currentTarget.getAttribute('data-result'));
          if (!this.selectedTags.some((tag) => tag._id === result._id)) this.addTag(result);
          else this.removeTag(result);
        });
      });
    }
  }
}

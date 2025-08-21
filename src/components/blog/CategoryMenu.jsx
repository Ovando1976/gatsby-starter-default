import React from 'react';
import '../../styles/blog.module.css';

const CATEGORY_LIST = [
  'All',
  'Technology',
  'Travel',
  'Health',
  'Lifestyle',
  'Food',
  'General',
];

function CategoryMenu({ selectedCategory, onCategoryChange }) {
  return (
    <>
      <h2>Categories</h2>
      <ul>
        {CATEGORY_LIST.map((cat) => (
          <li
            key={cat}
            className={`${styles.sidebarItem} ${
              selectedCategory === cat ? styles.activeCategory : ''
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </>
  );
}

export default CategoryMenu;
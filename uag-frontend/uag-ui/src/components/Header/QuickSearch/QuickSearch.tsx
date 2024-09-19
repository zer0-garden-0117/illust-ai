import React from 'react';
import { MdSearch } from "react-icons/md";
import classes from './QuickSearch.module.css';

interface QuickSearchProps {
  onSearchClick: () => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ onSearchClick }) => {
  return (
    <div className={classes.clickableIcon} onClick={onSearchClick}>
      <MdSearch
        size="1.5rem"
        className={classes.searchIcon}
        aria-label="Open search menu"
      />
    </div>
  );
};
import React from 'react';
import { MdSearch } from "react-icons/md";
import classes from './QuickSearch.module.css';

interface QuickSearchProps {
  onSearchClick: () => void;
  isSearching: boolean;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ onSearchClick, isSearching }) => {
  return (
    <div className={classes.clickableIcon} onClick={onSearchClick}>
      <MdSearch
        size="1.5rem"
        className={`${classes.searchIcon} ${isSearching ? classes.active : ''}`}
        aria-label="Open search menu"
      />
    </div>
  );
};
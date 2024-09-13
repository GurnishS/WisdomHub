import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import ItemContainer from "./ItemContainer";

export default function ProfileList({ heading, itemsCopy, setItemsCopy }) {
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 8;
  const [sortBy, setSortBy] = useState("Name[A-Z]");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(itemsCopy);
  const searchInJSONObject = (searchTerm, jsonObject) => {
    try {
      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = searchTerm.toLowerCase();

      // Perform search
      const results = [];

      // Iterate over each key-value pair in the JSON object
      for (let key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
          const item = jsonObject[key];

          // Check if any property value contains the search term
          let foundMatch = false;
          for (let prop in item) {
            if (item.hasOwnProperty(prop) && typeof item[prop] === "string") {
              if (item[prop].toLowerCase().includes(searchTermLower)) {
                foundMatch = true;
                break;
              }
            }
          }

          // If any property contains the search term, add to results
          if (foundMatch) {
            results.push(item);
          }
        }
      }
      return results;
    } catch (error) {
      console.error("Error searching in JSON object:", error);
      return [];
    }
  };

  useEffect(() => {
    setItems(searchInJSONObject(searchTerm, itemsCopy));
  }, [searchTerm]);

  function sortObjectByTitle(dataArray, key) {
    if (!Array.isArray(dataArray)) {
      throw new Error("Expected an array as input for sorting.");
    }

    const sortedArray = [...dataArray].sort((a, b) => {
      const valueA = a[key].toUpperCase();
      const valueB = b[key].toUpperCase();
      return valueA.localeCompare(valueB);
    });

    return sortedArray;
  }

  function sortObjectByTitleReverse(dataArray, key) {
    if (!Array.isArray(dataArray)) {
      throw new Error("Expected an array as input for sorting.");
    }

    const sortedArray = [...dataArray].sort((a, b) => {
      const valueA = a[key].toUpperCase();
      const valueB = b[key].toUpperCase();
      return valueB.localeCompare(valueA);
    });
    return sortedArray;
  }

  useEffect(() => {
    if (sortBy === "Name[A-Z]") setItems(sortObjectByTitle(items, "title"));
    else if (sortBy === "Name[Z-A]")
      setItems(sortObjectByTitleReverse(items, "title"));
    else if (sortBy === "Oldest")
      setItems(sortObjectByTitle(items, "createdAt"));
    else if (sortBy === "Newest")
      setItems(sortObjectByTitleReverse(items, "createdAt"));
  }, [sortBy]);

  // Calculate the current page's items based on pageNumber
  const currentPageItems = items.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  return (
    <>
      <SearchBox
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {currentPageItems.map((item) => (
              <ItemContainer heading={heading} item={item} key={item?._id} />
            ))}
          </div>
        </div>
      </div>
      <Pagination
        pageNumber={pageNumber}
        resultNumber={items.length}
        onPageChange={setPageNumber}
      />
    </>
  );
}

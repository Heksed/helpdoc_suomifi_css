import React from 'react'
import HeaderBar from './HeaderBar'
import LeftRail from './LeftRail'
import MiddleList from './MiddleList'
import RightEditor from './RightEditor'

function ShellLayout({
  selectedItem,
  onItemSelect,
  onItemUpdate,
  onItemCreate,
  onItemCopy,
  onItemArchive,
  onItemDelete,
  searchQuery,
  onSearchChange,
  items,
  filteredItems,
  selectedContentType,
  selectedCategory,
  onContentTypeSelect,
  onCategorySelect,
  selectedGroupId,
  selectedStatus,
  onStatusFilterChange,
  showArchived,
  onShowArchivedChange
}) {
  return (
    <>
      <HeaderBar selectedItem={selectedItem} />
      <main className="helpdoc-shell-main">
        <LeftRail
          selectedContentType={selectedContentType}
          selectedCategory={selectedCategory}
          onContentTypeSelect={onContentTypeSelect}
          onCategorySelect={onCategorySelect}
          selectedGroupId={selectedGroupId}
        />
        <MiddleList
          items={filteredItems}
          selectedItem={selectedItem}
          onItemSelect={onItemSelect}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedStatus={selectedStatus}
          onStatusFilterChange={onStatusFilterChange}
          selectedContentType={selectedContentType}
          selectedCategory={selectedCategory}
          selectedGroupId={selectedGroupId}
          onItemCreate={onItemCreate}
          showArchived={showArchived}
          onShowArchivedChange={onShowArchivedChange}
        />
        <RightEditor 
          selectedItem={selectedItem} 
          onItemUpdate={onItemUpdate}
          onItemCopy={onItemCopy}
          onItemArchive={onItemArchive}
          onItemDelete={onItemDelete}
          selectedContentType={selectedContentType}
          selectedCategory={selectedCategory}
          onItemCreate={onItemCreate}
        />
      </main>
    </>
  )
}

export default ShellLayout

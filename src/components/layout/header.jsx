"use client"

import { ModeToggle } from "./mode-toggle"
import { GlobalSearch } from "./global-search"
import { Notifications } from "./notifications"
import { UserMenu } from "./user-menu"
import { Breadcrumbs } from "./breadcrumbs"

export function Header() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Notifications />
          <ModeToggle />
          <UserMenu />
        </div>
      </header>
      <div className="px-4 lg:px-6 pt-4">
        <Breadcrumbs />
      </div>
    </div>
  )
}


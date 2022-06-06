import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modules } from '~/providers/modules'
import Module from '~/components/Module'

export default function Home() {
  const dashLinks = modules.map(({ route: { title, icon, path: to } }) => ({
    title,
    to,
    icon,
  }))

  return (
    <Module>
      <nav className="grid grid-cols-3 gap-4">
        {dashLinks.map(({ title, to, icon }) => (
          <Link
            to={to}
            key={title}
            className="flex items-center justify-center rounded-xl bg-gray-800 p-8 font-bold shadow-lg transition-all hover:bg-gray-700 hover:shadow-sm"
          >
            <div className="space-y-2">
              <div className="text-8xl">
                <FontAwesomeIcon icon={icon} />
              </div>
              <div>
                <span>{title}</span>
              </div>
            </div>
          </Link>
        ))}
      </nav>
    </Module>
  )
}

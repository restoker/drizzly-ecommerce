'use client'

import { MouseEventHandler, Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Dialog, DialogPanel } from '@headlessui/react'

// import { Navigation } from '@/components/Navigation'
import { Logomark } from './Logo'
import { signOut, useSession } from 'next-auth/react'
import { getSessionUser } from '@/server/actions/getSession'
import { Session } from 'next-auth'
import UserMenu from './UserMenu'

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  )
}

function CloseOnNavigation({ close }: { close: () => void }) {
  let pathname = usePathname()
  let searchParams = useSearchParams()

  useEffect(() => {
    close()
  }, [pathname, searchParams, close])

  return null
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const user = {
  name: 'Chelsea Hagon',
  email: 'chelsea.hagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Directory', href: '#', current: false },
]

export function MobileNavigation() {
  let [isOpen, setIsOpen] = useState(false);
  const [sesion, setSesion] = useState(false);
  const [usuario, setUsuario] = useState<Session | undefined>(undefined);


  let close = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {

    (async () => {
      const session = await getSessionUser();
      if (session.ok) {
        setUsuario(session.session);
        setSesion(session.ok);
      }
    })()

  }, []);

  const cerrarSesion: MouseEventHandler<HTMLAnchorElement> | undefined = async (e) => {
    e.preventDefault();
    await signOut();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6 stroke-slate-500" />
      </button>
      <Suspense fallback={null}>
        <CloseOnNavigation close={close} />
      </Suspense>
      <Dialog
        open={isOpen}
        onClose={() => close()}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden"
        aria-label="Navigation"
      >
        <DialogPanel className="min-h-full w-full max-w-xs bg-white px-4 pb-12 pt-5 sm:px-6 dark:bg-slate-900">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => close()}
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6 stroke-slate-500" />
            </button>
            <Link href="/" className="ml-6" aria-label="Home page">
              <Logomark className="h-9 w-9" />
            </Link>
          </div>

          {/* navegacion aqui */}
          <div className="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
              <div className="flex-shrink-0">
                <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>

            </div>
            <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
              <UserMenu />
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}

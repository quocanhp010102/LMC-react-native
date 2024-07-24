import { HambergerMenu } from 'iconsax-react'
import { ReactNode, useContext } from 'react'
import clsx from 'clsx'
import { SidebarContext } from '../App'

type Props = { children: ReactNode }

const Sidebar = ({ children }: Props) => {
    const { collapsed, toggleCollapsed } = useContext(SidebarContext)

    return (
        <>
            <div
                className={clsx(
                    ' h-full text-gray-600 font-medium border-r-2 transition-all duration-[250] border-solid border-slate-300',
                    {
                        'side-bar': !collapsed,
                        side_bar_hidden: collapsed,
                    },
                )}
            >
                <div>
                    <div
                        className={clsx('text-lg w-full flex flex-row py-7 hover:cursor-pointer', {
                            'justify-center': !collapsed,
                            'justify-start': collapsed,
                        })}
                        onClick={toggleCollapsed}
                    >
                        <span className={clsx({ 'pl-6': collapsed })}>
                          <img src='/img/menu_side_bar.png' alt='menu' />
                        </span>
                        <span
                            className={clsx('md:text-base sc1366:text-base font-medium sc1920:text-lg ml-[12px]', {
                                'side-bar-item': !collapsed,
                                'side-bar-item_show': collapsed,
                            })}
                        >
                            Menu
                        </span>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}
export default Sidebar

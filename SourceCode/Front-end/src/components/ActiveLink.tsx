import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom'
import clsx from 'clsx'

export default function CustomLink({ children, to, ...props }: LinkProps) {
    const resolved = useResolvedPath(to)
    const match = useMatch({ path: resolved.pathname, end: false })

    return (
        <Link
            style={{
                backgroundColor: match ? 'rgba(119, 173, 255, 0.1)' : '#fff',
                color: match ? 'var(--blue-bold)' : '#7D7D7D',
            }}
            to={to}
            {...props}
            className={clsx(`${props.className}`, { 'active-link': match })}
        >
            {children}
        </Link>
    )
}

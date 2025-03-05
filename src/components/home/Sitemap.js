import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";






const SiteMap = () => {
    const router = useRouter();

    const siteMapContactLinks = [
        { text: 'Contact Us', href: '/contact' },
        { text: 'KYC/AML', href: '/contact' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms Of Service', href: '/tos' },
        { text: 'Disclaimer', href: '/disclaimer' },
        { text: 'Sitemap', href: '/sitemap' },
    ]

    const siteMapLinks = [
        { text: 'Home', href: '/' },
        { text: 'Casinos', href: '/casinos' },
        { text: 'Bank', href: '/bank' },
        // { text: 'Leaderboard', href: '/leaderboard' },
        { text: 'About Us', href: '/about' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'Sitemap', href: '/sitemap' },
    ]

    const siteMapSocialLinks = [
        { text: 'Twitter', href: 'https://twitter.com' },
        { text: 'Telegram', href: 'https://telegram.com' },
        {
            text: 'Discord', href: 'https://discord.com'
        },
    ]




    return (
        <div>
            <div className="cont pb-16">
                <div className="bg-dark-460 lg:p-16 p-4 text-center">
                    <div>
                        <h3 className="text-4xl"><span className="text-primary">Sitemap</span></h3>
                    </div>
                    <div className="grid grid-cols-2">
                        {/* links */}
                        <div className="flex justify-center flex-col gap-4 mt-4">
                            {
                                siteMapLinks.map((v, i) => (
                                    v.text === 'Sitemap' ? null : <a key
                                        ={i} href={v.href} className="hover:text-primary flex">{v.text}</a>
                                ))
                            }
                        </div>

                        {/* contact links */}
                        <div className="flex flex-col justify-center gap-4 mt-4">
                            {
                                siteMapContactLinks.map((v, i) => (
                                    v.text === 'Sitemap' ? null : <a key
                                        ={i} href={v.href} className="hover:text-primary">{v.text}</a>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteMap;
import Link from 'next/link';
import { Github, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';

const socialLinks = [
    { icon: Github, url: "https://github.com/surajacharya12", label: "GitHub" },
    { icon: Instagram, url: "https://www.instagram.com/suraj_acharyaa10/", label: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/surajacharyaa/", label: "LinkedIn" },
    { icon: Facebook, url: "https://www.facebook.com/auraj.acharya/", label: "Facebook" },
    { icon: Twitter, url: "https://x.com/SURAJAC22891334", label: "Twitter" },
];

const Footer = () => {
    return (
        // Changed bg-gradient to deep purple/black tones and adjusted text color to white/gray
        <footer className="w-full py-10 bg-[#09051a] border-t border-white/10 transition-colors duration-500">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 px-6 md:px-12">

                {/* Branding & Text */}
                <p className="text-sm text-gray-400 text-center md:text-left leading-relaxed">
                    Built with ❤️ by{" "}
                    <span className="font-bold text-white hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                        Suraj Acharya
                    </span>
                    .
                </p>

                {/* Social Icons */}
                <div className="flex items-center gap-5">
                    {socialLinks.map(({ icon: Icon, url, label }) => (
                        <Link
                            key={label}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                        >
                            <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                            <span className="sr-only">{label}</span>
                            {/* Animated tooltip */}
                            <span className="absolute bottom-full mb-2 px-2 py-1 text-xs text-black bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
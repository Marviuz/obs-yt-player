import { PiTwitchLogoLight } from 'react-icons/pi';

import { SOCIALS } from '@/constants/socials';

const Footer = () => {
  return (
    <footer className="text-white bg-gray-700 border-t border-gray-300">
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-end gap-2 text-md">
          <span>Support me @</span>
          {SOCIALS.map(({ Icon, label, link }, i) => (
            <div className="relative flex group" key={i}>
              <a href={link} target="_blank" className="text-xl">
                <Icon />
              </a>
              <span className="absolute -top-full px-1 m-4 mx-auto text-sm text-gray-100 transition-opacity -translate-x-1/2 -translate-y-full bg-gray-800 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 left-1/2 w-[max-content]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

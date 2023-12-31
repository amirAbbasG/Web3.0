import {useState} from "react";

import {HiMenuAlt4} from "react-icons/hi"
import {AiOutlineClose} from "react-icons/ai"

import logo from "../../images/logo.png"

const NavBarItem = ({title, classProps}) => (
    <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
);

const NavBar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const navItems = ["Market", "Exchange", "Tutorials", "Wallets"]

    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer"/>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {navItems.map((item, index) => (
                    <NavBarItem key={item + index} title={item}/>
                ))}
                <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                    Login
                </li>
            </ul>
            <div className="flex relative">
                {!toggleMenu && (
                    <HiMenuAlt4
                        fontSize={28}
                        className="text-white md:hidden cursor-pointer"
                        onClick={() => setToggleMenu(true)}
                    />
                )}
                {toggleMenu && (
                    <AiOutlineClose
                        fontSize={28}
                        className="text-white md:hidden cursor-pointer"
                        onClick={() => setToggleMenu(false)}
                    />
                )}
                {toggleMenu && (
                    <ul
                        className="z-10 fixed -top-0 -right-0 p-3 w-[50vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col items-center rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)} className="cursor-pointer"/>
                        </li>
                        {navItems.map((item, index) => (
                                <NavBarItem
                                    key={item + index}
                                    title={item}
                                    classProps="my-2 text-lg text-center w-full border-b border-white"
                                />
                            )
                        )}
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
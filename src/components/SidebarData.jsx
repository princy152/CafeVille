import React from "react";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: "Master",
    path: "#",
    icon: <RiIcons.RiUserSettingsFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add Item",
        path: "/add-item",
        icon: <MdIcons.MdFastfood />,
      },
      {
        title: "Add Size",
        path: "/add-size",
        icon: <BsIcons.BsCupStraw />,
      },
    ],
  },
  {
    title: "Customer",
    path: "/customers",
    icon: <HiIcons.HiOutlineUsers />,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: <RiIcons.RiBillLine />,
  },
];

import { Dropdown, Modal } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import { MdOutlineMessage, MdNotificationsNone } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import { RootState } from "../Redux/store";
import { fetchMessages } from "../Redux/Adminslice/messageSlice";
import type { MenuProps } from 'antd';

interface TopBarProps {
  userRole: string;
  items?: any[];
}

interface Message {
  id?: string;
  sender: {
    firstName: string;
    lastName: string;
  } | string;
  messageText?: string;
}

export default function TopBar({ userRole, items = [] }: TopBarProps) {
  const { t, i18n } = useTranslation();
  const [filteredItems, setFilteredItems] = useState(items);
  const [calendarModal, setCalendarModal] = useState(false);
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [value, setValue] = useState<any>(new Date());
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const messages: Message[] = useSelector((state: RootState) => {
    const stateMessages = state.messages.messages;
    
    // Transform messages if needed to match the Message interface
    return stateMessages.map((msg: any) => {
      // If sender is a string, convert to the expected format
      if (typeof msg.sender === 'string') {
        return {
          ...msg,
          sender: {
            firstName: msg.sender.split(' ')[0] || '',
            lastName: msg.sender.split(' ')[1] || '',
          }
        };
      }
      return msg;
    });
  });
  
  const messageCount: number = useSelector((state: RootState) => state.messages.messageCount);

  useEffect(() => {
    dispatch(fetchMessages() as any);
  }, [dispatch]);

  const menuItems: MenuProps['items'] = messages.map((msg) => ({
    key: msg.id ?? '',
    label: (
      <div className="flex flex-col p-2 border">
        <p className="flex text-sm my-1">
          Names: {typeof msg.sender === 'string' 
            ? msg.sender 
            : `${msg.sender.firstName} ${msg.sender.lastName}`}
        </p>
        <div className="flex gap-1 my-2">
          <MdOutlineMessage size={20} className="text-black" />
          <span className="text-black text-sm">{msg.messageText}</span>
        </div>
      </div>
    ),
  }));

  const handleLogout = () => {
    navigate("/");
    setOpen(false);
  };

  const menus = [
    { label: "Logout", onClick: handleLogout },
  ];

  const handleModal = () => {
    setCalendarModal(true);
  };

  const handleCancel = () => {
    setCalendarModal(false);
  };

  const handleCalendarChange = (nextValue: any) => {
    setValue(nextValue);
  };
  

  useEffect(() => {
    const storedName = localStorage.getItem("fullName");
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedName) {
      setName(storedName);
    }
    if (storedProfileImage) {
      setProfilePhoto(storedProfileImage);
    }
  }, []);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage).then(() => {
      if (filteredItems !== items) {
        setFilteredItems([...items]);
      }
    });
  };

  return (
    <header className="bg-white shadow-md w-full fixed z-50">
      <div className="max-w-4xl mx-10 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <h1 className="lg:text-xl font-semibold text-purple-600 sm:text-sm md:text-sm">
          {userRole === "therapist" ? t('Therapist_dashboard') : t('Admin_dashboard')}
        </h1>

        <div className="flex gap-4 items-center">
          <div className="text-gray-600 text-lg">
            <select
              id="languageSelect"
              className="form-select p-1 rounded border-2 border-gray-100"
              aria-label="Default select example"
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="kin">Kinyarwanda</option>
            </select>
          </div>

          <button className="text-purple-600 mx-3" onClick={handleModal}>
            <IoCalendarNumber size={20} />
          </button>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="relative">
              <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <MdOutlineMessage className="text-xl ml-5 text-purple-600" />
                {messageCount > 0 && (
                  <span className="absolute -top-3 -right-1 italic rounded-full text-xl font-medium text-red-500">{messageCount}</span>
                )}
              </a>
            </div>
          </Dropdown>

          <a href="#" data-bs-toggle="dropdown">
            <MdNotificationsNone className="text-xl ml-5 text-purple-600" />
          </a>

          <div className="flex items-center gap-2 relative ml-5">
            <img
              onClick={() => setOpen(!open)}
              src={profilePhoto || "https://via.placeholder.com/40"}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <span
              className="text-gray-700 font-medium capitalize text-lg cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {name}
            </span>
            {open && (
              <div className="top-12 absolute bg-white shadow w-60 rounded-md">
                <ul>
                  {menus.map((menu) =>
                    <li
                      key={menu.label}
                      onClick={menu.onClick}
                      className="text-lg font-semibold text-red-500 flex justify-center cursor-pointer p-1 mt-1 gap-2 hover:bg-blue-100 rounded"
                    >
                      <LogoutOutlined />{menu.label}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Calendar"
        footer={null}
        open={calendarModal}
        onCancel={handleCancel}
        className="text-center"
      >
        <div className="flex justify-center">
          <Calendar
            onChange={handleCalendarChange}
            value={value}
          />
        </div>
      </Modal>
    </header>
  );
}
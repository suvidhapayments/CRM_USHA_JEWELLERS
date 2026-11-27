import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  Menu
} from 'lucide-react';

export const MobileBottomNav = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, customers, sales } = useApp();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: customers.length
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: ShoppingBag,
      badge: sales.length
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: Receipt,
      badge: null
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-dock px-3 py-2 flex items-center justify-around lg:hidden no-print">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-[#1E65FF] font-bold'
                : 'text-slate-500 hover:text-navy-950 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#1E65FF] stroke-[2.5]' : 'text-slate-500'}`} />
              {tab.badge !== null && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-[#1E65FF] text-white text-[9px] font-bold px-1.5 rounded-full min-w-4 text-center shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer button */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-navy-950 font-medium rounded-2xl transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight font-semibold">More</span>
      </button>
    </div>
  );
};

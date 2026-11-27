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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg no-print">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-amber-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-700 stroke-[2.5]' : 'text-slate-500'}`} />
              {tab.badge !== null && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 text-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer button */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-800 font-medium rounded-xl transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">More</span>
      </button>
    </div>
  );
};

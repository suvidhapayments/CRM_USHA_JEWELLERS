import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { generateNextId } from '../../utils/formatters';
import { Upload, User, Phone, MapPin, FileText, CreditCard } from 'lucide-react';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
];

export const CustomerFormModal = () => {
  const {
    isNewCustomerOpen,
    setIsNewCustomerOpen,
    editingCustomer,
    setEditingCustomer,
    customers,
    handleAddCustomer,
    handleUpdateCustomer,
    handleUploadPhoto
  } = useApp();

  const isOpen = isNewCustomerOpen || Boolean(editingCustomer);
  const isEditing = Boolean(editingCustomer);

  const [formData, setFormData] = useState({
    customer_code: '',
    name: '',
    mobile: '',
    alternate_mobile: '',
    address: '',
    aadhaar_number: '',
    photo_url: '',
    notes: '',
    created_date: new Date().toISOString().split('T')[0]
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        customer_code: editingCustomer.customer_code || '',
        name: editingCustomer.name || '',
        mobile: editingCustomer.mobile || '',
        alternate_mobile: editingCustomer.alternate_mobile || '',
        address: editingCustomer.address || '',
        aadhaar_number: editingCustomer.aadhaar_number || '',
        photo_url: editingCustomer.photo_url || '',
        notes: editingCustomer.notes || '',
        created_date: editingCustomer.created_at ? editingCustomer.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setPhotoPreview(editingCustomer.photo_url || '');
    } else if (isNewCustomerOpen) {
      const nextCode = generateNextId('CUST', customers, 'customer_code');
      setFormData({
        customer_code: nextCode,
        name: '',
        mobile: '',
        alternate_mobile: '',
        address: '',
        aadhaar_number: '',
        photo_url: '',
        notes: '',
        created_date: new Date().toISOString().split('T')[0]
      });
      setPhotoPreview('');
    }
    setErrors({});
  }, [editingCustomer, isNewCustomerOpen, customers]);

  const handleClose = () => {
    setIsNewCustomerOpen(false);
    setEditingCustomer(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (formData.alternate_mobile) {
      const cleanAlt = formData.alternate_mobile.replace(/\D/g, '');
      if (cleanAlt.length !== 10) {
        newErrors.alternate_mobile = 'Alternate mobile must be 10 digits';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Customer address is required for KYC';
    }

    if (formData.aadhaar_number) {
      const cleanAadhaar = formData.aadhaar_number.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        newErrors.aadhaar_number = 'Aadhaar must be exactly 12 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const url = await handleUploadPhoto(file, editingCustomer?.id);
      setPhotoPreview(url);
      setFormData(prev => ({ ...prev, photo_url: url }));
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSelectSampleAvatar = (url) => {
    setPhotoPreview(url);
    setFormData(prev => ({ ...prev, photo_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      await handleUpdateCustomer(editingCustomer.id, {
        customer_code: formData.customer_code,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        alternate_mobile: formData.alternate_mobile.trim(),
        address: formData.address.trim(),
        aadhaar_number: formData.aadhaar_number.replace(/\D/g, ''),
        photo_url: formData.photo_url || photoPreview,
        notes: formData.notes.trim()
      });
    } else {
      await handleAddCustomer({
        customer_code: formData.customer_code,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        alternate_mobile: formData.alternate_mobile.trim(),
        address: formData.address.trim(),
        aadhaar_number: formData.aadhaar_number.replace(/\D/g, ''),
        photo_url: formData.photo_url || photoPreview,
        notes: formData.notes.trim(),
        created_at: new Date(formData.created_date).toISOString()
      });
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? `Edit Customer: ${editingCustomer.name}` : 'Add New Customer'}
      subtitle={isEditing ? `Customer ID: ${editingCustomer.customer_code}` : 'Register customer profile with KYC & gold purchase history'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer ID & Created Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Customer ID (Auto-generated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.customer_code}
                onChange={(e) => setFormData({ ...formData, customer_code: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-amber-800 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                placeholder="CUST-2026-001"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded font-sans">
                Unique
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Registration Date
            </label>
            <input
              type="date"
              value={formData.created_date}
              onChange={(e) => setFormData({ ...formData, created_date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Customer Photo Upload & Sample Chooser */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Customer Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-amber-50 border-2 border-amber-300 flex-shrink-0 flex items-center justify-center shadow-xs">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Customer Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-amber-700" />
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                  Uploading...
                </div>
              )}
            </div>

            {/* Upload Button & Sample Selection */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs">
                  <Upload className="w-4 h-4" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(''); setFormData(p => ({ ...p, photo_url: '' })); }}
                    className="text-xs text-rose-600 hover:text-rose-800 underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Quick sample portraits */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500">Sample avatars:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {SAMPLE_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSampleAvatar(url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                        photoPreview === url ? 'border-amber-600 scale-105' : 'border-slate-300 opacity-70'
                      }`}
                    >
                      <img src={url} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Customer Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-400' : 'border-slate-300'} rounded-xl pl-10 pr-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white`}
              placeholder="e.g. Rajesh Ramniklal Sharma"
              required
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        {/* Mobile & Alternate Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Customer Mobile Number *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-xs text-slate-500 font-medium">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className={`w-full bg-slate-50 border ${errors.mobile ? 'border-rose-400' : 'border-slate-300'} rounded-xl pl-12 pr-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white`}
                placeholder="98201 23456"
                required
              />
            </div>
            {errors.mobile && <p className="text-xs text-rose-600 mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Alternate Mobile (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-xs text-slate-500 font-medium">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={formData.alternate_mobile}
                onChange={(e) => setFormData({ ...formData, alternate_mobile: e.target.value.replace(/\D/g, '') })}
                className={`w-full bg-slate-50 border ${errors.alternate_mobile ? 'border-rose-400' : 'border-slate-300'} rounded-xl pl-12 pr-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white`}
                placeholder="Optional family / shop phone"
              />
            </div>
            {errors.alternate_mobile && <p className="text-xs text-rose-600 mt-1">{errors.alternate_mobile}</p>}
          </div>
        </div>

        {/* Aadhaar Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Aadhaar Number (12 Digits)
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              maxLength={12}
              value={formData.aadhaar_number}
              onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value.replace(/\D/g, '') })}
              className={`w-full bg-slate-50 border ${errors.aadhaar_number ? 'border-rose-400' : 'border-slate-300'} rounded-xl pl-10 pr-3.5 py-2 text-slate-900 font-mono text-sm tracking-wider focus:outline-none focus:border-amber-500 focus:bg-white`}
              placeholder="e.g. 5489 6321 7890"
            />
          </div>
          {errors.aadhaar_number && <p className="text-xs text-rose-600 mt-1">{errors.aadhaar_number}</p>}
        </div>

        {/* Customer Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Customer Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full bg-slate-50 border ${errors.address ? 'border-rose-400' : 'border-slate-300'} rounded-xl pl-10 pr-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white`}
              placeholder="Flat / Building, Street, Area, City, Pin Code"
              required
            />
          </div>
          {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes / Jewellery Preferences (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              placeholder="e.g. Prefers 22K antique gold, VIP client, monthly installment scheme enrollment"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-xs transition-all duration-150"
          >
            {isEditing ? 'Save Changes' : 'Create Customer Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

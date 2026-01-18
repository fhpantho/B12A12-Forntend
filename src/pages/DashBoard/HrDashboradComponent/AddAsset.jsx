import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import UseAuth from '../../../hooks/UseAuth';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { toast } from 'react-toastify';

const AddAsset = () => {
  const { dbUser, user } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      productName: '',
      productType: 'Returnable',
      quantity: '',
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // ✅ track image uploading

  const IMGBB_API_KEY = import.meta.env.VITE_imagehostapikey;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload image to ImgBB
  const uploadToImgBB = async (file) => {
    setUploadingImage(true); // ✅ start uploading
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      return data.data.url;
    } finally {
      setUploadingImage(false); // ✅ stop uploading
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setServerError('');
    setSuccess(false);

    if (!selectedFile) {
      setError('image', { type: 'required', message: 'Product image is required' });
      return;
    }

    try {
      const imageUrl = await uploadToImgBB(selectedFile); // ✅ wait for image first
      const token = await user.getIdToken(true);

      const assetData = {
        productName: data.productName,
        productImage: imageUrl,
        productType: data.productType,
        productQuantity: Number(data.quantity),
        hrEmail: dbUser?.email,
        companyName: dbUser?.companyName,
      };

      await axiosSecure.post('/assetcollection', assetData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Asset added successfully');
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Failed to add asset. Please try again.');
      toast.error('Failed to add asset. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <PlusIcon className="w-8 h-8 text-primary" />
            Add New Asset
          </h1>
          <p className="text-base-content/70 mt-2">
            Add a new product/item to your company's asset list
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Product Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dell Laptop XPS 15"
                  className={`input input-bordered w-full ${errors.productName ? 'input-error' : ''}`}
                  {...register('productName', { required: 'Product name is required' })}
                />
                {errors.productName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.productName.message}</span>
                  </label>
                )}
              </div>

              {/* Product Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Product Type</span>
                </label>
                <select className="select select-bordered w-full" {...register('productType')}>
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Quantity</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 10"
                  className={`input input-bordered w-full ${errors.quantity ? 'input-error' : ''}`}
                  {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                />
                {errors.quantity && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.quantity.message}</span>
                  </label>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Product Image</span>
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-w-sm max-h-96 rounded-lg object-contain shadow-lg" />
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-base-300 rounded-lg cursor-pointer bg-base-200 hover:border-primary transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-16 h-16 text-base-400" />
                        <p className="mt-4 text-sm text-base-content/70">Click to upload or drag and drop</p>
                        <p className="text-xs text-base-content/50">PNG, JPG, GIF (hosted on ImgBB)</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                {errors.image && <label className="label mt-2"><span className="label-text-alt text-error">{errors.image.message}</span></label>}
              </div>

              {/* Server Error */}
              {serverError && <div className="alert alert-error shadow-lg flex items-center gap-2"><ExclamationTriangleIcon className="w-6 h-6" />{serverError}</div>}

              {/* Success Message */}
              {success && <div className="alert alert-success shadow-lg">Asset added successfully!</div>}

              {/* Submit Button */}
              <div className="card-actions justify-end mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage || !selectedFile} // ✅ disable while uploading image
                  className="btn btn-primary btn-wide text-lg flex items-center justify-center gap-2"
                >
                  {(isSubmitting || uploadingImage) && <span className="loading loading-spinner"></span>}
                  {isSubmitting ? 'Adding Asset...' : uploadingImage ? 'Uploading Image...' : 'Add Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;

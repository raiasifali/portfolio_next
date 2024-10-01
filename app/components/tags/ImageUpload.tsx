import React from "react";

interface ImageUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileChange,
  imagePreviews,
  onRemoveImage,
}) => {
  return (
    <div>
      <label className="block mb-2">Upload Images (Max 4)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="mb-4"
      />
      <div className="flex space-x-2">
        {imagePreviews.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;

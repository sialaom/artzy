"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CustomizationOptions {
  colors?: string[];
  maxTextLength?: number;
  allowImageUpload?: boolean;
}

interface ProductCustomizationProps {
  options: CustomizationOptions | null;
  onCustomize: (customization: any) => void;
}

export default function ProductCustomization({
  options,
  onCustomize,
}: ProductCustomizationProps) {
  const [text, setText] = useState("");
  const [color, setColor] = useState(options?.colors?.[0] || "");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSubmit = () => {
    const customization: any = {};
    if (text) customization.text = text;
    if (color) customization.color = color;
    if (uploadedImage) customization.image = uploadedImage;
    onCustomize(customization);
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">Personnalisation</h3>

      {options?.maxTextLength && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Texte à graver ({text.length}/{options.maxTextLength})
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= (options.maxTextLength || 100)) {
                setText(e.target.value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            maxLength={options.maxTextLength}
          />
          {text && (
            <div className="mt-2 p-4 bg-gray-50 rounded text-center">
              <p className="text-lg font-semibold" style={{ color: color || "#000" }}>
                {text}
              </p>
              <p className="text-xs text-gray-500 mt-2">Aperçu</p>
            </div>
          )}
        </div>
      )}

      {options?.colors && options.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Couleur</label>
          <div className="flex gap-2">
            {options.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 ${
                  color === c ? "border-gray-800" : "border-gray-300"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {options?.allowImageUpload && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Image personnalisée
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // In production, upload to Cloudinary
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUploadedImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {uploadedImage && (
            <div className="mt-2 relative h-32 w-32">
              <img src={uploadedImage} alt="Preview" className="object-cover rounded" />
            </div>
          )}
        </div>
      )}

      <Button onClick={handleSubmit} className="w-full">
        Appliquer la personnalisation
      </Button>
    </div>
  );
}

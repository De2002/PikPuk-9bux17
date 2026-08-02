import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;            // current URL (controlled)
  onChange: (url: string) => void;
  folder?: string;          // sub-folder inside cms-media bucket (e.g. "authors" | "covers")
  aspectClass?: string;     // Tailwind aspect ratio class for preview (default: "aspect-[3/4]")
  label?: string;
  hint?: string;
}

const BUCKET = "cms-media";

const ImageUpload = ({
  value,
  onChange,
  folder = "uploads",
  aspectClass = "aspect-[3/4]",
  label = "Image",
  hint,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Use fetch+blob method for reliable upload
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: file.type, upsert: false });

    if (error) {
      setUploading(false);
      toast.error("Upload failed: " + error.message);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className={cn(
            "relative flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 border-dashed bg-[#fafafa] transition-colors",
            aspectClass,
            dragging ? "border-[#18181b] bg-[#f4f4f5]" : "border-[#e4e4e7]",
            uploading && "opacity-60"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Clear button */}
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                title="Remove image"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-[#a1a1aa] animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 text-[#d4d4d8]" />
                  <span className="text-[9px] text-[#c4c4c7] font-sans text-center leading-tight px-1">
                    Drop here
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f4f4f5] hover:bg-[#ebebeb] border border-[#e4e4e7] rounded-lg text-sm font-sans text-[#52525b] hover:text-[#18181b] transition-all disabled:opacity-50 w-full justify-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Image
              </>
            )}
          </button>

          {/* URL input as fallback */}
          <div className="space-y-1">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste an image URL…"
              className="w-full px-3 py-2 border border-[#e4e4e7] rounded-lg text-xs font-sans text-[#52525b] placeholder:text-[#c4c4c7] focus:outline-none focus:ring-2 focus:ring-[#18181b]/10"
            />
          </div>

          {hint && (
            <p className="text-[11px] text-[#a1a1aa] font-sans leading-snug">{hint}</p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ImagePlus } from 'lucide-react';

interface Props {
    files: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
}

export function PhotoUploader({ files, onChange, maxFiles = 1 }: Props) {
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);
        const combined = [...files, ...newFiles].slice(0, maxFiles);
        onChange(combined);

        e.target.value = '';
    }

    function removeFile(index: number) {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
    }

    return (
        <div className="space-y-2">
            <Label>
                Lampiran Foto ({files.length}/{maxFiles})
            </Label>

            {/* Grid Preview */}
            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {files.length < maxFiles && (
                <div>
                    <Input
                        type="file"
                        id="photo-upload"
                        accept="image/jpeg,image/png,image/webp,image/heic"
                        multiple={maxFiles > 1}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Label
                        htmlFor="photo-upload"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ImagePlus className="h-4 w-4" />
                        Pilih Foto
                    </Label>
                </div>
            )}
        </div>
    );
}

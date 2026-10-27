import { useRef, useState } from 'react';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';

export default function ImagePicker({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch {
      setError('That image could not be uploaded. Try a PNG or JPG.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">Background image</span>
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={upload} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-1.5 h-3 w-3" />
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              aria-label="Remove background image"
              onClick={() => onChange('')}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {value ? (
        <div className="h-16 overflow-hidden rounded-lg border border-border">
          <Image src={value} alt="Panel background" className="h-full w-full" fittingType="fill" />
        </div>
      ) : (
        <p className="text-[11px] leading-snug text-muted-foreground">
          <ImageIcon className="mr-1 inline h-3 w-3" />
          Sits behind the readings. Save it as a PNG on your desktop and the settings app will pick it up.
        </p>
      )}

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WaCallDialogProps {
  open: boolean;
  onClose: () => void;
}

export function WaCallDialog({ open, onClose }: WaCallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm rounded-3xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-red-600">🆘 108 — Яаралтай залгах</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 text-sm mb-5 mt-1">
          WhatsApp-аар Улаанбаатарын <strong>108</strong> тусламжийн дугаарт залга:
        </p>
        <a href="whatsapp://call?phone=+976108" className="block mb-3">
          <Button className="w-full rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black h-12 text-base shadow-lg gap-2">
            📱 WhatsApp-аар 108 залгах
          </Button>
        </a>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-2 text-left">
          <p className="text-amber-700 text-sm font-semibold mb-2">
            ⚠️ WhatsApp байхгүй бол:
          </p>
          <p className="text-amber-600 text-sm mb-3">
            WhatsApp татаж аваад өөрийн account-аар нэвтэрнэ үү.
          </p>
          <a href="https://www.whatsapp.com/download" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" size="sm" className="w-full rounded-xl border-green-300 text-green-700 hover:bg-green-50">
              📲 WhatsApp татах
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

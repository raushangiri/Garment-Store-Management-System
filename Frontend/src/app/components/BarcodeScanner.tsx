import { useState, useEffect, useRef } from 'react';
import { X, Camera, Keyboard, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (barcode: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onScanComplete }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [mode, setMode] = useState<'camera' | 'manual'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (scannerRef.current && isScanning) {
        cleanupScanner();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setMode('manual');
      setCameraError(null);
      setIsInitializing(false);
      if (scannerRef.current && isScanning) {
        cleanupScanner();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mode === 'camera' && !isScanning && !isInitializing) {
      startScanning();
    } else if (mode === 'manual' && isScanning) {
      cleanupScanner();
    }
  }, [mode, isOpen]);

  const cleanupScanner = async () => {
    if (scannerRef.current) {
      try {
        if (isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.log('Cleanup error (can be ignored):', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
        setIsInitializing(false);
      }
    }
  };

  const startScanning = async () => {
    setIsInitializing(true);
    setCameraError(null);

    try {
      // First, check if the element exists
      const element = document.getElementById('barcode-reader');
      if (!element) {
        throw new Error('Scanner element not found. Please try again.');
      }

      // Clean up any existing scanner
      await cleanupScanner();

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create new scanner instance
      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      // Try to get camera permissions and start scanning
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778
        },
        (decodedText) => {
          // Success callback
          onScanComplete(decodedText);
          toast.success('Barcode scanned successfully');
          cleanupScanner();
          onClose();
        },
        (errorMessage) => {
          // Error callback - runs frequently, so we ignore it
        }
      );

      setIsScanning(true);
      setIsInitializing(false);
      setCameraError(null);
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setIsInitializing(false);
      
      // Cleanup on error
      await cleanupScanner();

      // Provide user-friendly error messages
      let errorMessage = 'Failed to access camera. ';
      
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings and try again.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('No camera')) {
        errorMessage = 'No camera found on this device. Please use manual entry instead.';
      } else if (err.name === 'NotReadableError' || err.message?.includes('in use')) {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required features. Please use manual entry.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setCameraError(errorMessage);
      toast.error('Camera access failed. Please use manual entry.');
      
      // Auto-switch to manual mode after error
      setTimeout(() => {
        setMode('manual');
      }, 2000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanComplete(manualBarcode.trim());
      setManualBarcode('');
      onClose();
    }
  };

  const handleClose = async () => {
    await cleanupScanner();
    setManualBarcode('');
    setCameraError(null);
    setMode('manual');
    onClose();
  };

  const handleModeChange = async (newMode: 'camera' | 'manual') => {
    if (newMode === 'manual') {
      await cleanupScanner();
    }
    setCameraError(null);
    setMode(newMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Scan Barcode</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                mode === 'manual'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
            <button
              onClick={() => handleModeChange('camera')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                mode === 'camera'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
          </div>

          {mode === 'camera' ? (
            <div className="space-y-4">
              <div
                id="barcode-reader"
                className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden"
              />
              
              {isInitializing && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm text-slate-600 mt-2">Initializing camera...</p>
                </div>
              )}

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 mb-1">Camera Access Error</p>
                      <p className="text-sm text-red-700">{cameraError}</p>
                      <div className="mt-3 space-y-2 text-xs text-red-600">
                        <p className="font-semibold">How to fix:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Click the camera icon in your browser's address bar</li>
                          <li>Allow camera access for this website</li>
                          <li>Refresh the page and try again</li>
                          <li>Or use manual entry below</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!cameraError && !isInitializing && isScanning && (
                <p className="text-sm text-slate-600 text-center">
                  Position the barcode within the frame to scan
                </p>
              )}

              {/* Quick switch to manual */}
              {cameraError && (
                <button
                  onClick={() => setMode('manual')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm font-medium"
                >
                  Switch to Manual Entry
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Barcode Number
                </label>
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
                  placeholder="Enter barcode..."
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!manualBarcode.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Barcode
              </button>
            </form>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Tip:</span> If camera scanning doesn't work, you can always enter the barcode manually using the keyboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';

const Tandatangan = ({ onSignatureChange }) => {
    const canvasRef = useRef(null);
    const [signaturePad, setSignaturePad] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize signature pad when component mounts
        const canvas = canvasRef.current;
        const pad = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });
        setSignaturePad(pad);

        // Cleanup on unmount
        return () => {
            if (pad) {
                pad.clear();
            }
        };
    }, []);

    const clearSignature = () => {
        if (signaturePad) {
            signaturePad.clear();
            setError('');
            if (onSignatureChange) {
                onSignatureChange(null);
            }
        }
    };

    const handleSignatureEnd = () => {
        if (signaturePad && !signaturePad.isEmpty()) {
            const signatureData = signaturePad.toDataURL();
            if (onSignatureChange) {
                onSignatureChange(signatureData);
            }
            setError('');
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tanda Tangan Digital</h6>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <canvas
                        ref={canvasRef}
                        width="400"
                        height="150"
                        style={{ border: '1px solid #000' }}
                        onMouseUp={handleSignatureEnd}
                        onTouchEnd={handleSignatureEnd}
                    />
                    <button
                        onClick={clearSignature}
                        className="btn btn-danger mt-2"
                    >
                        Clear Signature
                    </button>
                    {error && <p className="text-danger">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Tandatangan;

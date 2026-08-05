import joblib
import numpy as np
import pandas as pd
from typing import Optional, List, Dict, Any
from pathlib import Path

class ModelLoader:
    """Singleton class for loading and managing ML artefacts."""
    
    _instance = None
    _model = None
    _scaler = None
    _encoder = None
    _feature_names = None
    _loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance
    
    @classmethod
    def load_model(
        cls,
        model_path: str,
        scaler_path: Optional[str] = None,
        encoder_path: Optional[str] = None,
        features_path: Optional[str] = None
    ) -> bool:
        """Load ML artefacts from disk."""
        try:
            # Load model
            if Path(model_path).exists():
                cls._model = joblib.load(model_path)
                print(f"  ✅ Model loaded from {model_path}")
            else:
                print(f"  ⚠️ Model not found at {model_path}")
                return False
            
            # Load scaler
            if scaler_path and Path(scaler_path).exists():
                cls._scaler = joblib.load(scaler_path)
                print(f"  ✅ Scaler loaded from {scaler_path}")
            
            # Load encoder
            if encoder_path and Path(encoder_path).exists():
                cls._encoder = joblib.load(encoder_path)
                print(f"  ✅ Encoder loaded from {encoder_path}")
            
            # Load feature names
            if features_path and Path(features_path).exists():
                cls._feature_names = joblib.load(features_path)
                print(f"  ✅ Feature names loaded from {features_path}")
            
            cls._loaded = True
            return True
            
        except Exception as e:
            print(f"  ❌ Error loading ML artefacts: {e}")
            cls._loaded = False
            return False
    
    @classmethod
    def is_loaded(cls) -> bool:
        """Check if model is loaded."""
        return cls._loaded
    
    @classmethod
    def get_model(cls):
        """Get loaded model."""
        if not cls._loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        return cls._model
    
    @classmethod
    def get_scaler(cls):
        """Get loaded scaler."""
        return cls._scaler
    
    @classmethod
    def get_encoder(cls):
        """Get loaded encoder."""
        return cls._encoder
    
    @classmethod
    def get_feature_names(cls):
        """Get loaded feature names."""
        return cls._feature_names
    
    @classmethod
    def predict(cls, features: List[float]) -> Dict[str, Any]:
        """Make a prediction using the loaded model."""
        if not cls._loaded or cls._model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Convert to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Scale if scaler exists
        if cls._scaler is not None:
            features_array = cls._scaler.transform(features_array)
        
        # Get prediction
        prediction = cls._model.predict(features_array)[0]
        
        # Get probabilities
        probabilities = cls._model.predict_proba(features_array)[0]
        
        return {
            "prediction": prediction,
            "probabilities": probabilities.tolist(),
            "confidence": float(max(probabilities))
        }
    
    @classmethod
    def clear(cls):
        """Clear loaded artefacts."""
        cls._model = None
        cls._scaler = None
        cls._encoder = None
        cls._feature_names = None
        cls._loaded = False
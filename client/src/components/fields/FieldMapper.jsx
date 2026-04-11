import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMap, 
  faSave, 
  faEraser, 
  faExclamationTriangle, 
  faSeedling,
  faLocationDot,
  faTag,
  faMapMarkerAlt,
  faInfoCircle,
  faEdit,
  faCheckCircle,
  faLayerGroup,
  faRulerCombined,
  faMapPin,
  faSpinner,
  faDrawPolygon,
  faLandmark
} from '@fortawesome/free-solid-svg-icons';
import { createField } from '../../services/dataService';
import googleMapsLoader from '../../utils/googleMapsLoader';
import './FieldMapper.css';

const FieldMapper = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldLocation, setFieldLocation] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [message, setMessage] = useState({ show: false, text: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [drawingMode, setDrawingMode] = useState(true); // True = Draw Mode, False = Edit Mode
  const [fieldArea, setFieldArea] = useState(0);
  
  // List of major crops grown in India
  const cropOptions = [
    t('crops.rice', 'Rice'), t('crops.wheat', 'Wheat'), t('crops.maize', 'Maize'), t('crops.jowar', 'Jowar (Sorghum)'), t('crops.bajra', 'Bajra (Pearl Millet)'), 
    t('crops.cotton', 'Cotton'), t('crops.sugarcane', 'Sugarcane'), t('crops.pulses', 'Pulses'), t('crops.groundnut', 'Groundnut'), t('crops.mustard', 'Mustard'), 
    t('crops.soybean', 'Soybean'), t('crops.sunflower', 'Sunflower'), t('crops.jute', 'Jute'), t('crops.coffee', 'Coffee'), t('crops.tea', 'Tea'), 
    t('crops.rubber', 'Rubber'), t('crops.tobacco', 'Tobacco'), t('crops.onion', 'Onion'), t('crops.potato', 'Potato'), t('crops.tomato', 'Tomato')
  ];

  // Initialize the Google Maps and drawing tools
  useEffect(() => {
    const loadMaps = async () => {
      try {
        await googleMapsLoader.loadGoogleMaps(['drawing', 'geometry']);
        initMap();
      } catch (error) {
        setMessage({
          show: true,
          text: t('pages.createField.mapsNotLoaded', 'Failed to load Google Maps. Please check your internet connection.'),
          type: 'error'
        });
      }
    };

    loadMaps();
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;
    
    // Check if Google Maps API is properly loaded
    if (!window.google || !window.google.maps) {
      setMessage({
        show: true,
        text: t('pages.createField.mapsApiError', 'Google Maps API is not loaded properly.'),
        type: 'error'
      });
      return;
    }
    
    // Custom map style to enhance agricultural features
    const mapStyle = [
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dde2e3"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
          {
            "color": "#c6e8b3"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#c6e8b3"
          },
          {
            "visibility": "on"
          }
        ]
      }
    ];
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center on India
      zoom: 6,
      mapTypeId: 'satellite', // Changed to satellite for better field visualization
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_LEFT,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
      },
      streetViewControl: false,
      fullscreenControl: true,
      styles: mapStyle,
      scaleControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM
      }
    });
    
    // Check if drawing library is loaded
    if (!window.google.maps.drawing || !window.google.maps.drawing.DrawingManager) {
      setMessage({
        show: true,
        text: t('pages.createField.drawingLibError', 'Drawing library not loaded.'),
        type: 'error'
      });
      return;
    }
    
    const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        strokeColor: '#2563eb',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2563eb',
        fillOpacity: 0.35,
        editable: true
      }
    });
    
    drawingManagerInstance.setMap(mapInstance);
    
    window.google.maps.event.addListener(
      drawingManagerInstance, 
      'polygoncomplete', 
      (polygon) => handlePolygonComplete(polygon)
    );
    
    setMap(mapInstance);
    setDrawingManager(drawingManagerInstance);
  };

  const handlePolygonComplete = (polygon) => {
    // Remove previous polygon if it exists
    if (currentPolygon) {
      currentPolygon.setMap(null);
    }
    
    setCurrentPolygon(polygon);
    
    // Turn off drawing mode
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
    
    // Get coordinates from polygon
    const coords = getPolygonCoordinates(polygon);
    setCoordinates(coords);
    
    // Calculate field area
    const area = calculatePolygonArea(coords);
    setFieldArea(area);
    
    // Add listener for path changes
    const updateCoordinatesAndArea = () => {
      const updatedCoords = getPolygonCoordinates(polygon);
      setCoordinates(updatedCoords);
      setFieldArea(calculatePolygonArea(updatedCoords));
    };
    
    window.google.maps.event.addListener(
      polygon.getPath(), 
      'set_at', 
      updateCoordinatesAndArea
    );
    
    window.google.maps.event.addListener(
      polygon.getPath(), 
      'insert_at', 
      updateCoordinatesAndArea
    );
    
    // Display success message
    setMessage({
      show: true,
      text: t('pages.createField.boundaryDrawnSuccess', 'Boundary drawn successfully.'),
      type: 'success'
    });
    
    // Switch to edit mode
    setDrawingMode(false);
  };

  const getPolygonCoordinates = (polygon) => {
    if (!polygon) return [];
    
    const path = polygon.getPath();
    const coords = [];
    
    path.forEach(latLng => {
      coords.push({ lat: latLng.lat(), lng: latLng.lng() });
    });
    
    return coords;
  };

  const handleClearAll = () => {
    if (currentPolygon) {
      currentPolygon.setMap(null);
      setCurrentPolygon(null);
    }
    
    setCoordinates([]);
    setFieldName('');
    setFieldLocation('');
    setSelectedCrop('');
    setFieldArea(0);
    
    if (drawingManager) {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
    
    // Switch back to drawing mode
    setDrawingMode(true);
    
    setMessage({
      show: true,
      text: t('pages.createField.mapCleared', 'Map cleared.'),
      type: 'info'
    });
  };
  
  // Toggle between draw and edit modes
  const toggleDrawingMode = () => {
    if (drawingMode) {
      // Switching to edit mode
      if (drawingManager) {
        drawingManager.setDrawingMode(null);
      }
    } else {
      // Switching to draw mode
      if (drawingManager) {
        drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      }
    }
    setDrawingMode(!drawingMode);
  };

  const handleSaveField = async () => {
    // Validate input
    if (!fieldName.trim()) {
      setMessage({
        show: true,
        text: t('pages.createField.emptyFieldName', 'Field name is required.'),
        type: 'error'
      });
      return;
    }
    
    if (!fieldLocation.trim()) {
      setMessage({
        show: true,
        text: t('pages.createField.emptyFieldLocation', 'Location is required.'),
        type: 'error'
      });
      return;
    }
    
    if (!selectedCrop) {
      setMessage({
        show: true,
        text: t('pages.createField.selectCrop', 'Please select a crop.'),
        type: 'error'
      });
      return;
    }
    
    if (!coordinates || coordinates.length < 3) {
      setMessage({
        show: true,
        text: t('pages.createField.invalidPolygon', "Please draw a polygon with at least 3 points."),
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate field area in hectares
      const area = calculatePolygonArea(coordinates);
      
      // Validate data before sending
      if (!fieldName.trim()) {
        throw new Error(t('pages.createField.emptyFieldName', 'Field name is required'));
      }
      
      if (!coordinates || coordinates.length < 3) {
        throw new Error(t('pages.createField.invalidPolygon', 'Please draw a field boundary with at least 3 points'));
      }
      
      if (area <= 0) {
        throw new Error(t('pages.createField.invalidArea', 'Invalid field area calculated. Please redraw the field boundary'));
      }
      
      // Create field data object (matching Flask backend schema)
      const fieldData = {
        field_name: fieldName.trim(),
        location: fieldLocation.trim(),
        coordinates: coordinates,
        area: Math.round(area * 100) / 100, // Round to 2 decimal places
        current_crop: selectedCrop,
        soil_type: t('pages.dashboard.unknown', 'Unknown'), // Default value
        status: t('pages.dashboard.active', 'Active')
      };
      
      console.log('Sending field data to Flask backend:', fieldData);
      
      // Save to Flask backend using dataService
      const result = await createField(fieldData);
      
      if (!result.success) {
        throw new Error(result.error || t('pages.createField.fieldSaveError', 'Failed to save field data'));
      }
      
      setMessage({
        show: true,
        text: t('pages.createField.fieldSavedSuccess', 'Field saved successfully!'),
        type: 'success'
      });
      
      // Clear form after successful save but keep the success message visible
      if (currentPolygon) {
        currentPolygon.setMap(null);
        setCurrentPolygon(null);
      }
      
      setCoordinates([]);
      setFieldName('');
      setFieldLocation('');
      setSelectedCrop('');
      setFieldArea(0);
      
      // Switch back to drawing mode
      if (drawingManager) {
        drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      }
      setDrawingMode(true);
      
    } catch (error) {
      console.error('Error saving field:', error);
      setMessage({
        show: true,
        text: t('pages.createField.fieldSaveError', 'Failed to save field.'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="field-mapper">
      <div className="field-mapper-header">
        <h2>
          <FontAwesomeIcon icon={faDrawPolygon} className="mr-2" />
          {t('pages.createField.createFarmPlot', 'Create Farm Plot')}
        </h2>
        <p>{t('pages.createField.drawBoundariesDesc', 'Draw your field boundaries on the map and add crop information for better farm management and analytics.')}</p>
      </div>
      
      <div className="field-mapper-container">
        <div className="map-section">
          <div className="action-buttons">
            <button 
              className={`btn ${drawingMode ? 'btn-save' : 'btn-secondary'}`}
              onClick={toggleDrawingMode}
              disabled={loading || !currentPolygon}
            >
              <FontAwesomeIcon icon={drawingMode ? faEdit : faMapPin} />
              {drawingMode ? t('pages.createField.editMode', 'Edit Mode') : t('pages.createField.drawMode', 'Draw Mode')}
            </button>
            
            <button 
              className="btn btn-clear" 
              onClick={handleClearAll}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faEraser} />
              {t('pages.createField.clearAll', 'Clear All')}
            </button>
          </div>
          
          <div className="map-wrapper">
            <div 
              ref={mapRef} 
              className="map-container"
            ></div>
            
            <div className="mode-indicator">
              <FontAwesomeIcon icon={drawingMode ? faMapPin : faEdit} />
              {drawingMode ? t('pages.createField.drawingMode', 'Drawing Mode') : t('pages.createField.editMode', 'Edit Mode')}
            </div>
            
            <div className="map-instructions">
              <FontAwesomeIcon icon={faInfoCircle} />
              {drawingMode 
                ? t('pages.createField.drawInstructions', 'Click on the map to add points and create a polygon. Complete the shape by connecting to the first point.') 
                : t('pages.createField.editInstructions', 'Drag the points to adjust the field boundary. Add new points by clicking on the boundary lines.')}
            </div>
          </div>
          
          {coordinates.length > 0 && fieldArea > 0 && (
            <div className="field-summary">
              <div className="field-summary-item">
                <span className="field-summary-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {t('pages.createField.points', 'Points')}:
                </span>
                <span className="field-summary-value">{coordinates.length}</span>
              </div>
              <div className="field-summary-item">
                <span className="field-summary-label">
                  <FontAwesomeIcon icon={faRulerCombined} /> {t('pages.createField.area', 'Area')}:
                </span>
                <span className="field-summary-value">
                  {fieldArea.toFixed(2)} {t('pages.dashboard.hectares', 'hectares')}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="field-mapper-sidebar">
          <div className="field-details field-info-card">
            <div className="field-info-header">
              <FontAwesomeIcon icon={faInfoCircle} className="field-info-icon" />
              <h3>{t('pages.dashboard.fieldInformation', 'Field Information')}</h3>
            </div>
            
            <div className="field-form">
              <div className="form-group required form-group-animated">
                <label htmlFor="fieldNameInput">
                  <FontAwesomeIcon icon={faTag} />
                  {t('pages.dashboard.fieldName', 'Field Name')} <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  id="fieldNameInput" 
                  className={`form-control ${loading ? 'form-loading' : ''}`}
                  placeholder={t('pages.createField.fieldNamePlaceholder', 'Enter Field Name (e.g. North Plot)')}
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  disabled={loading}
                />
                <div className="form-help-text">
                  {t('pages.createField.fieldNameHelp', 'Give your field a unique, recognizable name')}
                </div>
              </div>
              
              <div className="form-group required form-group-animated">
                <label htmlFor="fieldLocation">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {t('pages.dashboard.location', 'Location')} <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="fieldLocation" 
                    className={`form-control ${loading ? 'form-loading' : ''}`}
                    placeholder={t('pages.createField.locationPlaceholder', 'Field Location (e.g. Nashik, Maharashtra)')}
                    value={fieldLocation}
                    onChange={(e) => setFieldLocation(e.target.value)}
                    disabled={loading}
                  />
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                </div>
                <div className="form-help-text">
                  {t('pages.createField.locationHelp', 'Enter a descriptive location for your field')}
                </div>
              </div>

              <div className="form-group required form-group-animated">
                <label htmlFor="cropSelect">
                  <FontAwesomeIcon icon={faSeedling} />
                  {t('pages.createField.selectCrop', 'Select Crop')} <span className="required-star">*</span>
                </label>
                <div className="custom-select-wrapper">
                  <select
                    id="cropSelect"
                    className={`form-control custom-select ${loading ? 'form-loading' : ''}`}
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">{t('pages.createField.selectCropDefault', '-- Select Crop --')}</option>
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-help-text">
                  {t('pages.createField.cropHelp', 'Select the crop you are planning to grow in this field')}
                </div>
              </div>
            </div>
          </div>
          
          {coordinates.length > 0 && (
            <div className="field-details">
              <h3>
                <FontAwesomeIcon icon={faLayerGroup} />
                {t('pages.createField.fieldBoundary', 'Field Boundary')}
              </h3>
              
              <div className="field-summary">
                <div className="field-summary-item">
                  <span className="field-summary-label">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {t('pages.createField.boundaryPoints', 'Boundary Points')}
                  </span>
                  <span className="field-summary-value">{coordinates.length}</span>
                </div>
                <div className="field-summary-item">
                  <span className="field-summary-label">
                    <FontAwesomeIcon icon={faRulerCombined} /> {t('pages.createField.fieldArea', 'Field Area')}
                  </span>
                  <span className="field-summary-value">
                    {fieldArea.toFixed(2)} {t('pages.dashboard.hectares', 'ha')}
                  </span>
                </div>
              </div>
              
              <div className="coordinates-table">
                <h4>
                  <FontAwesomeIcon icon={faMapPin} />
                  {t('pages.createField.gpsCoordinates', 'GPS Coordinates')}
                </h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t('pages.dashboard.point', 'Point')}</th>
                        <th>{t('pages.dashboard.latitude', 'Latitude')}</th>
                        <th>{t('pages.dashboard.longitude', 'Longitude')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordinates.map((point, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{point.lat.toFixed(6)}</td>
                          <td>{point.lng.toFixed(6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="sticky-action-bar">
                <div className="button-group button-group-spaced">
                  <button 
                    className="btn btn-save btn-animated" 
                    onClick={handleSaveField}
                    disabled={loading || coordinates.length < 3 || !fieldName || !selectedCrop}
                  >
                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={loading ? 'fa-spin' : ''} />
                    {loading ? t('pages.dashboard.saving', 'Saving...') : t('pages.createField.saveField', 'Save Field')}
                  </button>
                  
                  <button 
                    className="btn btn-clear" 
                    onClick={handleClearAll}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faEraser} />
                    {t('pages.createField.clearBtn', 'Clear')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {message.show && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'error' && (
            <FontAwesomeIcon icon={faExclamationTriangle} />
          )}
          {message.type === 'success' && (
            <FontAwesomeIcon icon={faCheckCircle} />
          )}
          {message.type === 'info' && (
            <FontAwesomeIcon icon={faInfoCircle} />
          )}
          {message.text}
          <button 
            className="alert-close" 
            onClick={() => setMessage({ show: false, text: '', type: 'info' })}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate polygon area in hectares
const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) return 0;

  // Implementation of the Shoelace formula to calculate polygon area
  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area += coordinates[i].lat * coordinates[j].lng;
    area -= coordinates[j].lat * coordinates[i].lng;
  }

  area = Math.abs(area) / 2;
  
  // Convert square degrees to hectares
  const degreeToMeter = 111319.9; // At equator, varies by latitude
  const squareMetersToHectares = 0.0001;
  
  return area * Math.pow(degreeToMeter, 2) * squareMetersToHectares;
};

export default FieldMapper;

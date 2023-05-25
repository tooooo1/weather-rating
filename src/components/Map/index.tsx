/* global kakao */
import {
  VStack,
  Box,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCityDustInfos } from '@/apis/dustInfo';
import { getAllLocation } from '@/apis/location';
import { DustLevel } from '@/components/common';
import MarkerModalButton from '@/components/Map/MarkerModalButton';
import MarkerModalDustInfo from '@/components/Map/MarkerModalDustInfo';
import { useSidoDustInfoList } from '@/hooks/useDustInfo';
import useMap from '@/hooks/useMap';
import theme from '@/styles/theme';
import type { CityDustInfo, SidoDustInfo } from '@/types/dust';
import type { MapAndMakers } from '@/types/map';
import {
  FINE_DUST,
  ULTRA_FINE_DUST,
  DUST_GRADE,
  CITY_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  COLOR_MARKER_MOUSE_OVER,
  COLOR_MARKER_MOUSE_OUT,
  ZINDEX_MARKER_MOUSE_OVER,
  ZINDEX_MARKER_MOUSE_OUT,
  ROUTE,
} from '@/utils/constants';
import ControlButton from './ControlButton';

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const sidoDustInfoMarkers: kakao.maps.CustomOverlay[] = [];
  const [cityDustInfoMarkers, setCityDustInfoMarkers] = useState<
    kakao.maps.CustomOverlay[]
  >([]);
  const [city, setCity] = useState('동네 정보를 받아오지 못했어요');
  const [dustInfo, setDustInfo] = useState({
    fineDustScale: 0,
    fineDustGrade: 0,
    ultraFineDustScale: 0,
    ultraFineDustGrade: 0,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    map,
    zoomLevel,
    currentSido,
    currentLocation,
    handleCurrentLocationChange,
    handleZoomIn,
    handleZoomOut,
    handleFullScreenChange,
  } = useMap({ mapRef, cityDustInfoMarkers });
  const navigate = useNavigate();

  const sidoDustInfoList = useSidoDustInfoList({
    refetchOnWindowFocus: false,
  });

  const { data: cityDustInfos, isLoading: cityDustInfosIsLoading } = useQuery<
    CityDustInfo[]
  >(['city-dust-infos', currentSido], () => getCityDustInfos(currentSido), {
    staleTime: 1000 * 60 * 5,
  });

  const { data: allLocation } = useQuery(['all-location'], getAllLocation, {
    staleTime: 1000 * 60 * 5,
  });

  const makeMarkerTemplate = ({
    location,
    fineDustScale,
    fineDustGrade,
    ultraFineDustScale,
    ultraFineDustGrade,
  }: SidoDustInfo) => {
    const backgroundColor = theme.colors[DUST_GRADE[fineDustGrade]];

    return `
          <div class="dust-info-marker" id="${location}" 
          data-finedustscale="${fineDustScale} "data-finedustgrade="${fineDustGrade}" data-ultrafinedustscale="${ultraFineDustScale}" data-ultrafinedustgrade="${ultraFineDustGrade}" style="background-color: ${backgroundColor};">
            <p class="city-name">${location}</p>
            <div class="dust-info">
              <div>${fineDustScale}</div>
              <span class="divider">/</span>
              <div>${ultraFineDustScale}</div>  
            </div>
          </div>
    `;
  };

  const setMakerToNull = ({ map, markers }: MapAndMakers) => {
    if (map && markers.length) {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  };

  useEffect(() => {
    if (!map || !sidoDustInfoList || !allLocation) return;

    sidoDustInfoList.forEach(
      ({
        location,
        fineDustScale,
        fineDustGrade,
        ultraFineDustScale,
        ultraFineDustGrade,
      }) => {
        const { latitude, longitude } = allLocation.find(
          (scale) => scale.location === location
        ) || { latitude: 0, longitude: 0 };

        const template = makeMarkerTemplate({
          location,
          fineDustScale,
          fineDustGrade,
          ultraFineDustScale,
          ultraFineDustGrade,
        });

        const marker = new kakao.maps.CustomOverlay({
          clickable: true,
          position: new kakao.maps.LatLng(latitude, longitude),
          content: template,
        });

        sidoDustInfoMarkers.push(marker);
      }
    );

    sidoDustInfoMarkers.forEach((marker) => {
      marker.setMap(map);
    });

    return () => {
      setMakerToNull({ map, markers: sidoDustInfoMarkers });
    };
  }, [sidoDustInfoList, allLocation, sidoDustInfoMarkers]);

  useEffect(() => {
    if (
      !map ||
      !cityDustInfos ||
      cityDustInfosIsLoading ||
      (CITY_ZOOM_LEVEL <= zoomLevel && zoomLevel <= MAX_ZOOM_LEVEL)
    )
      return;

    const geocoder = new kakao.maps.services.Geocoder();

    cityDustInfos.forEach(
      ({
        location,
        fineDustScale,
        fineDustGrade,
        ultraFineDustScale,
        ultraFineDustGrade,
      }) => {
        geocoder.addressSearch(location, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const latitude = Number(result[0].y);
            const longitude = Number(result[0].x);

            const template = makeMarkerTemplate({
              location,
              fineDustScale,
              fineDustGrade,
              ultraFineDustScale,
              ultraFineDustGrade,
            });

            const marker = new kakao.maps.CustomOverlay({
              map,
              position: new kakao.maps.LatLng(latitude, longitude),
              content: template,
            });

            if (
              !cityDustInfoMarkers.find(
                (value) => value.getPosition() === marker.getPosition()
              )
            )
              setCityDustInfoMarkers((prev) => [...prev, marker]);
          }
        });
      }
    );

    return () => {
      setMakerToNull({ map, markers: cityDustInfoMarkers });
    };
  }, [cityDustInfos]);

  const handleClickMarker = useCallback((city: HTMLDivElement) => {
    setCity(city.id);

    const nextDustInfo = {
      fineDustScale: Number(city.dataset.finedustscale || 1),
      fineDustGrade: Number(city.dataset.finedustgrade || 1),
      ultraFineDustScale: Number(city.dataset.ultrafinedustscale || 1),
      ultraFineDustGrade: Number(city.dataset.ultrafinedustgrade || 1),
    };

    setDustInfo(nextDustInfo);
    onOpen();
  }, []);

  const handleMouseOverMarker = useCallback((city: HTMLDivElement) => {
    city.style.color = COLOR_MARKER_MOUSE_OVER;
    if (city.parentElement) {
      city.parentElement.style.zIndex = ZINDEX_MARKER_MOUSE_OVER;
    }
  }, []);

  const handleMouseOutMarker = useCallback((city: HTMLDivElement) => {
    city.style.color = COLOR_MARKER_MOUSE_OUT;
    if (city.parentElement) {
      city.parentElement.style.zIndex = ZINDEX_MARKER_MOUSE_OUT;
    }
  }, []);

  const handleClickForeCastButton = () => {
    navigate(
      `${ROUTE.DUST_FORECAST}?sido=${encodeURIComponent(
        currentSido
      )}&city=${encodeURIComponent(city)}`
    );
  };

  const handleClickGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document
      .querySelectorAll<HTMLDivElement>('.dust-info-marker')
      .forEach((city) => {
        city.onclick = () => handleClickMarker(city);
        city.onmouseover = () => handleMouseOverMarker(city);
        city.onmouseout = () => handleMouseOutMarker(city);
      });

    return () => {
      document
        .querySelectorAll<HTMLDivElement>('.dust-info-marker')
        .forEach((city) => {
          city.removeEventListener('click', () => handleClickMarker(city));
          city.removeEventListener('mouseover', () =>
            handleMouseOverMarker(city)
          );
          city.removeEventListener('mouseout', () =>
            handleMouseOutMarker(city)
          );
        });
    };
  }, [cityDustInfoMarkers, currentLocation, zoomLevel]);

  return (
    <Box position="relative" width="100%" height="100%">
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <Box position="absolute" top="1rem" left="1rem" zIndex={10}>
        <ControlButton type="go-back" onClick={handleClickGoBack} />
      </Box>
      <VStack position="absolute" top="1rem" right="1rem" zIndex={10}>
        <ControlButton
          type="current-location"
          onClick={handleCurrentLocationChange}
        />
        <ControlButton type="zoom-in" onClick={handleZoomIn} />
        <ControlButton type="zoom-out" onClick={handleZoomOut} />
        <ControlButton
          type="full-screen"
          onClick={() => handleFullScreenChange(cityDustInfoMarkers)}
        />
        <ControlButton type="go-back" onClick={handleClickGoBack} />
        {zoomLevel === MAX_ZOOM_LEVEL && !sidoDustInfoList && <Spinner />}
      </VStack>
      {cityDustInfosIsLoading ? <Spinner zIndex={10} /> : ''}
      <Box position="absolute" bottom="1.5rem" zIndex={10}>
        <DustLevel direction="column" />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{city}</ModalHeader>
          <ModalCloseButton borderColor={'#ffffff'} />
          <ModalBody>
            <MarkerModalDustInfo
              kindOfDust={FINE_DUST}
              dustScale={dustInfo.fineDustScale}
              dustGrade={dustInfo.fineDustGrade}
            />
            <MarkerModalDustInfo
              kindOfDust={ULTRA_FINE_DUST}
              dustScale={dustInfo.ultraFineDustScale}
              dustGrade={dustInfo.ultraFineDustGrade}
            />
          </ModalBody>
          <ModalFooter display="flex" justifyContent="space-around">
            <MarkerModalButton handleClick={handleClickForeCastButton}>
              예보 페이지로 이동하기
            </MarkerModalButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Map;

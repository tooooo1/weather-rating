import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@/components/Button';

const cityGroup = [
  { cityName: '서울', cityNumber: 0 },
  { cityName: '부산', cityNumber: 1 },
  { cityName: '대구', cityNumber: 2 },
  { cityName: '인천', cityNumber: 3 },
  { cityName: '광주', cityNumber: 4 },
  { cityName: '대전', cityNumber: 5 },
  { cityName: '울산', cityNumber: 6 },
  { cityName: '경기', cityNumber: 7 },
  { cityName: '강원', cityNumber: 8 },
  { cityName: '충북', cityNumber: 9 },
  { cityName: '충남', cityNumber: 10 },
  { cityName: '전북', cityNumber: 11 },
  { cityName: '전남', cityNumber: 12 },
  { cityName: '경북', cityNumber: 13 },
  { cityName: '경남', cityNumber: 14 },
  { cityName: '제주', cityNumber: 15 },
  { cityName: '세종', cityNumber: 16 },
];

const Choice = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState('서울');

  const handleClick = () => {
    navigate('/result', { state: place });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPlace(e.target.value);
  };

  return (
    <Wrapper>
      <img src="images/location.png" alt="location" width={30} height={30} />
      <SubTitle>한 눈에 확인하는</SubTitle>
      <Title>랭킹먼지</Title>
      <Text>미세먼지 농도가 궁금한 지역은?</Text>
      <Select onChange={handleChange} value={place}>
        {cityGroup.map((v) => (
          <option key={v.cityName} value={v.cityName}>
            {v.cityName}
          </option>
        ))}
      </Select>
      <Button color={'#2886A6'} onClick={handleClick}>
        검색
      </Button>
    </Wrapper>
  );
};

export default Choice;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Title = styled.div`
  font-size: 14vw;
  padding-bottom: 1.5rem;
  text-align: center;
  @media only screen and (min-width: 768px) {
    font-size: 60px;
  }
`;

const SubTitle = styled.div`
  font-size: 5vw;
  padding: 1rem 0;
  text-align: center;
  @media only screen and (min-width: 768px) {
    font-size: 20px;
  }
`;

const Text = styled.div`
  font-size: 3.5vw;
  margin-bottom: 1.5vh;
  text-align: center;
  @media only screen and (min-width: 768px) {
    font-size: 20px;
  }
`;

const Select = styled.select`
  height: 6vh;
  margin-bottom: 1rem;
  font-weight: bold;
  background-color: white;
  opacity: 0.8;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  padding-right: 1rem;
  padding-left: 1rem;
  border-radius: 10px;
  border: none;
  font-size: 16px;

  &:focus-visible {
    outline: white solid 2px;
  }

  option {
    border-radius: 8px;
    color: black;
  }
`;

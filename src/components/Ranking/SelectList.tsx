import { Select } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface SidoListProps {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectOptions: string[];
}

export const SidoList = ({ handleChange, selectOptions }: SidoListProps) => {
  return (
    <Select
      color="#4d4d4d"
      borderColor="#7f7f7f"
      borderWidth={2}
      fontSize={{ base: 14, sm: 16 }}
      mt={6}
      _focus={{ borderColor: 'none' }}
      onChange={handleChange}
    >
      {selectOptions.map((selectOption) => (
        <option key={selectOption}>{selectOption}</option>
      ))}
    </Select>
  );
};

export default SidoList;

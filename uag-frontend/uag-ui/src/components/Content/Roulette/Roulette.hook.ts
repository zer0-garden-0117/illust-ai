import { RouletteView } from "./Roulette.view";

export const useRoulette = (): React.ComponentPropsWithoutRef<
  typeof RouletteView
> => {
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};

import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { HandlerType } from "@/types/component";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

interface TvShowPlayerSeasonSelectionProps extends HandlerType {
  id: number;
  totalSeasons: number;
  currentSeason: number;
}

const TvShowPlayerSeasonSelection: React.FC<TvShowPlayerSeasonSelectionProps> = ({
  opened,
  onClose,
  id,
  totalSeasons,
  currentSeason,
}) => {
  const router = useRouter();

  const handleSeasonSelect = (season: number) => {
    router.push(`/tv/${id}/${season}/1/player`);
    onClose();
  };

  return (
    <VaulDrawer
      open={opened}
      onClose={onClose}
      backdrop="blur"
      title="Select Season"
      direction="right"
      hiddenHandler
      withCloseButton
    >
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-4 sm:p-4 md:grid-cols-3">
        {Array.from({ length: totalSeasons }, (_, i) => {
          const season = i + 1;
          const isActive = season === currentSeason;

          return (
            <Button
              key={season}
              onClick={() => handleSeasonSelect(season)}
              variant={isActive ? "solid" : "bordered"}
              color={isActive ? "primary" : "default"}
              className="w-full font-semibold"
            >
              Season {season}
            </Button>
          );
        })}
      </div>
    </VaulDrawer>
  );
};

export default TvShowPlayerSeasonSelection;
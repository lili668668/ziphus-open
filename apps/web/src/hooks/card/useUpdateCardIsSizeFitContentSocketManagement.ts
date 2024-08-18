import { useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { useQueryClient } from "@tanstack/react-query";
import useCardsStore from "@/stores/useCardsStore";
import useSpaceStore from "@/stores/useSpaceStore";

interface UpdateCardIsSizeFitContentData {
  cardId: string;
  isSizeFitContent: boolean;
}

function useUpdateCardIsSizeFitContentSocketManagement() {
  const { spaceId } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
    }))
  );
  const setCard = useCardsStore((state) => state.setCard);

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const handleCardIsSizeFitContent = (data: UpdateCardIsSizeFitContentData) => {
    setCard({
      id: data.cardId,
      isSizeFitContent: data.isSizeFitContent,
    });
    queryClient.invalidateQueries({ queryKey: ["cards", data.cardId] });
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  };

  // handler backend event
  useEffect(() => {
    socket?.on(
      `card:is-size-fit-content-modified`,
      (data: UpdateCardIsSizeFitContentData) => {
        handleCardIsSizeFitContent(data);
      }
    );

    return () => {
      socket?.off(`card:is-size-fit-content-modified`);
    };
  }, [socket]);
}

export default useUpdateCardIsSizeFitContentSocketManagement;

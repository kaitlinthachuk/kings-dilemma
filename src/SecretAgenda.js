import React, { useContext } from "react";
import GameContext from "./GameContext";

const SecretAgenda = () => {
  const {
    myHouse,
    houseData,
    gameState: { secretAgendas, turn },
    actions: { selectSecretAgenda },
  } = useContext(GameContext);
  return myHouse === turn ? (
    secretAgendas.map(({ name }) => (
      <div onClick={() => selectSecretAgenda(name)}>{name}</div>
    ))
  ) : (
    <p>{`${houseData[turn].houseName} is selecting a Secret Agenda`}</p>
  );
};

export default SecretAgenda;

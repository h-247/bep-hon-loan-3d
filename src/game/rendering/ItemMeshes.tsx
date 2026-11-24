'use client';

import React from 'react';
import { HeldItem, Ingredient, PlateItem, UtensilItem, IngredientType, DishType } from '../../types/game';

interface Item3DMeshProps {
  heldItem: HeldItem;
}

export const Item3DMesh: React.FC<Item3DMeshProps> = ({ heldItem }) => {
  if (heldItem.kind === 'ingredient') {
    return <IngredientMesh ingredient={heldItem.item} />;
  }
  if (heldItem.kind === 'plate') {
    return <PlateMesh plate={heldItem.item} />;
  }
  if (heldItem.kind === 'utensil') {
    return <UtensilMesh utensil={heldItem.item} />;
  }
  return null;
};

export const IngredientMesh: React.FC<{ ingredient: Ingredient; scale?: number }> = ({
  ingredient,
  scale = 1.0,
}) => {
  const isChopped = ingredient.state === 'chopped';
  const isCooked = ingredient.state === 'cooked';
  const isBurned = ingredient.state === 'burned';

  if (isBurned) {
    return (
      <group scale={[scale, scale, scale]}>
        <mesh>
          <dodecahedronGeometry args={[0.16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return (
    <group scale={[scale, scale, scale]}>
      {renderIngredientGeometry(ingredient.type, isChopped, isCooked)}
    </group>
  );
};

function renderIngredientGeometry(type: IngredientType, isChopped: boolean, isCooked: boolean) {
  switch (type) {
    case 'lettuce':
      return isChopped ? (
        <group>
          <mesh position={[-0.05, 0, 0]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.04, 0.08]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          <mesh position={[0.05, 0, 0]} rotation={[-0.1, 0.2, 0.3]}>
            <boxGeometry args={[0.09, 0.04, 0.08]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
      ) : (
        <mesh>
          <sphereGeometry args={[0.18, 12, 10]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
      );

    case 'tomato':
      return isChopped ? (
        <group>
          <mesh position={[-0.06, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 10]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 10]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh>
            <sphereGeometry args={[0.16, 14, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.05, 6]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      );

    case 'cucumber':
      return isChopped ? (
        <group>
          <mesh position={[-0.06, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 10]} />
            <meshStandardMaterial color="#86efac" />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 10]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </group>
      ) : (
        <mesh rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 10]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      );

    case 'onion':
      return isChopped ? (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09, 0.025, 8, 12]} />
            <meshStandardMaterial color="#e9d5ff" />
          </mesh>
        </group>
      ) : (
        <mesh>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color="#a855f7" roughness={0.5} />
        </mesh>
      );

    case 'potato':
      return isChopped ? (
        <group>
          <mesh position={[-0.05, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.18]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.18]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        </group>
      ) : (
        <mesh>
          <sphereGeometry args={[0.17, 10, 8]} scale={[1.2, 0.9, 0.9]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.8} />
        </mesh>
      );

    case 'beef':
      return (
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 14]} />
          <meshStandardMaterial color={isCooked ? '#78350f' : '#b91c1c'} roughness={0.6} />
        </mesh>
      );

    case 'fish':
      return isChopped ? (
        <mesh>
          <boxGeometry args={[0.18, 0.05, 0.12]} />
          <meshStandardMaterial color={isCooked ? '#ea580c' : '#fb923c'} />
        </mesh>
      ) : (
        <group>
          <mesh>
            <sphereGeometry args={[0.16, 10, 8]} scale={[1.5, 0.7, 0.8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      );

    case 'cheese':
      return (
        <mesh>
          <boxGeometry args={[0.16, 0.08, 0.14]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      );

    case 'bun':
      return (
        <mesh>
          <sphereGeometry args={[0.18, 14, 10]} scale={[1, 0.6, 1]} />
          <meshStandardMaterial color="#d97706" roughness={0.4} />
        </mesh>
      );

    case 'dough':
      return (
        <mesh>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.6} />
        </mesh>
      );

    case 'rice':
      return (
        <mesh>
          <cylinderGeometry args={[0.14, 0.1, 0.12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      );

    case 'seaweed':
      return (
        <mesh>
          <boxGeometry args={[0.2, 0.02, 0.16]} />
          <meshStandardMaterial color="#064e3b" roughness={0.9} />
        </mesh>
      );

    case 'egg':
      return (
        <mesh>
          <sphereGeometry args={[0.12, 12, 10]} scale={[0.9, 1.2, 0.9]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.3} />
        </mesh>
      );

    case 'pasta':
      return (
        <mesh>
          <torusGeometry args={[0.12, 0.04, 8, 14]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      );

    case 'mushroom':
      return (
        <group>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} scale={[1, 0.7, 1]} />
            <meshStandardMaterial color="#a16207" />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.1, 8]} />
            <meshStandardMaterial color="#fef9c3" />
          </mesh>
        </group>
      );

    case 'sauce':
      return (
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.08, 10]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      );

    default:
      return (
        <mesh>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      );
  }
}

export const PlateMesh: React.FC<{ plate: PlateItem }> = ({ plate }) => {
  return (
    <group>
      {/* Plate Ceramic Rim & Bottom */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.04, 20]} />
        <meshStandardMaterial
          color={plate.isDirty ? '#a8a29e' : '#f8fafc'}
          roughness={plate.isDirty ? 0.8 : 0.2}
        />
      </mesh>

      {/* Render Assembled Dish or Ingredients on Plate */}
      {plate.dishType ? (
        <AssembledDishMesh dishType={plate.dishType} />
      ) : (
        <group position={[0, 0.06, 0]}>
          {plate.ingredients.map((ing, idx) => (
            <group key={ing.id || idx} position={[(idx - 0.5) * 0.08, 0, 0]}>
              <IngredientMesh ingredient={ing} scale={0.75} />
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

export const AssembledDishMesh: React.FC<{ dishType: DishType }> = ({ dishType }) => {
  switch (dishType) {
    case 'salad':
      return (
        <group position={[0, 0.06, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.16, 12, 8]} scale={[1, 0.6, 1]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0.06, 0.05, 0.04]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-0.06, 0.05, -0.04]}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
            <meshStandardMaterial color="#86efac" />
          </mesh>
        </group>
      );

    case 'hamburger':
    case 'cheeseburger':
      return (
        <group position={[0, 0.05, 0]}>
          {/* Bottom Bun */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          {/* Beef Patty */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Cheese slice */}
          {dishType === 'cheeseburger' && (
            <mesh position={[0, 0.07, 0]} rotation={[0, 0.3, 0]}>
              <boxGeometry args={[0.18, 0.02, 0.18]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
          )}
          {/* Lettuce */}
          {dishType === 'hamburger' && (
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.18, 0.02, 0.18]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          )}
          {/* Top Bun */}
          <mesh position={[0, 0.11, 0]}>
            <sphereGeometry args={[0.16, 14, 10]} scale={[1, 0.6, 1]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
        </group>
      );

    case 'pizza':
    case 'mushroom_pizza':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          {/* Tomato sauce + Cheese */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          {/* Mushrooms */}
          {dishType === 'mushroom_pizza' && (
            <>
              <mesh position={[0.06, 0.04, 0.06]}>
                <cylinderGeometry args={[0.03, 0.03, 0.015, 6]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[-0.06, 0.04, -0.06]}>
                <cylinderGeometry args={[0.03, 0.03, 0.015, 6]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            </>
          )}
        </group>
      );

    case 'sushi':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh position={[-0.07, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
            <meshStandardMaterial color="#064e3b" />
          </mesh>
          <mesh position={[-0.07, 0.03, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#fb923c" />
          </mesh>
          <mesh position={[0.07, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
            <meshStandardMaterial color="#064e3b" />
          </mesh>
          <mesh position={[0.07, 0.03, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#fb923c" />
          </mesh>
        </group>
      );

    case 'fried_rice':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh>
            <sphereGeometry args={[0.17, 12, 8]} scale={[1, 0.6, 1]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      );

    case 'pasta':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 12, 8]} scale={[1, 0.6, 1]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.08, 10, 8]} scale={[1, 0.4, 1]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      );

    case 'onion_soup':
    case 'tomato_soup':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.14, 0.1, 14]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 14]} />
            <meshStandardMaterial color={dishType === 'onion_soup' ? '#a855f7' : '#ef4444'} />
          </mesh>
        </group>
      );

    case 'french_fries':
      return (
        <group position={[0, 0.06, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0.1]}>
            <boxGeometry args={[0.04, 0.16, 0.04]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0.04, 0, 0]} rotation={[-0.1, 0, -0.2]}>
            <boxGeometry args={[0.04, 0.16, 0.04]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      );

    case 'grilled_fish':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh>
            <boxGeometry args={[0.22, 0.04, 0.12]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          <mesh position={[0.08, 0.03, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>
      );

    default:
      return null;
  }
};

export const UtensilMesh: React.FC<{ utensil: UtensilItem }> = ({ utensil }) => {
  if (utensil.type === 'pan') {
    return (
      <group>
        {/* Pan Body */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Pan Handle */}
        <mesh position={[0.3, 0.06, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.24, 0.04, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Contents inside Pan */}
        {utensil.contents.map((ing, idx) => (
          <group key={ing.id || idx} position={[0, 0.06, 0]}>
            <IngredientMesh ingredient={ing} scale={0.6} />
          </group>
        ))}
      </group>
    );
  }

  if (utensil.type === 'pot') {
    return (
      <group>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.16, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.22, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.03, 0.06]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.22, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.03, 0.06]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    );
  }

  if (utensil.type === 'fire_extinguisher') {
    return (
      <group>
        {/* Red Tank */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.32, 14]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
        {/* Cap & Handle */}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.06, 10]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.08, 0.34, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.03, 0.03]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    );
  }

  return null;
};

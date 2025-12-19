import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import EntryAirlock from './components/layout/EntryAirlock';
import Canvas from './components/reader/Canvas';
import { LogicBoard } from './components/logic/LogicBoard';
import StyleDojo from './components/style/StyleDojo';
import { ViewToggle } from './components/layout/ViewToggle';

// Sample Text: Queen Elizabeth I - Speech at Tilbury
const ANCHOR_TEXT = `My loving people,

We have been persuaded by some that are careful of our safety, to take heed how we commit ourselves to armed multitudes, for fear of treachery; but I assure you I do not desire to live to distrust my faithful and loving people. Let tyrants fear. I have always so behaved myself that, under God, I have placed my chiefest strength and safeguard in the loyal hearts and good-will of my subjects; and therefore I am come amongst you, as you see, at this time, not for my recreation and disport, but being resolved, in the midst and heat of the battle, to live and die amongst you all; to lay down for my God, and for my kingdom, and my people, my honour and my blood, even in the dust.

I know I have the body but of a weak and feeble woman; but I have the heart and stomach of a king, and of a king of England too, and think foul scorn that Parma or Spain, or any prince of Europe, should dare to invade the borders of my realm; to which rather than any dishonour shall grow by me, I myself will take up arms, I myself will be your general, judge, and rewarder of every one of your virtues in the field.

I know already, for your forwardness you have deserved rewards and crowns; and We do assure you on the word of a prince, they shall be duly paid you. In the mean time, my lieutenant general shall be in my stead, than whom never prince commanded a more noble or worthy subject; not doubting but by your obedience to my general, by your concord in the camp, and your valour in the field, we shall shortly have a famous victory over those enemies of my God, of my kingdom, and of my people.`;

function App() {
  const [viewMode, setViewMode] = useState<'READER' | 'LOGIC' | 'STYLE'>('READER');

  return (
    <div className="app-container">
      {/* The Main Area */}
      <main className="main-reader relative" style={{ padding: 0 }}>

        {/* Floating Toggle (Top Right) */}
        <div className="absolute top-4 right-6 z-50">
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>

        {viewMode === 'READER' && (
          <EntryAirlock>
            <Canvas text={ANCHOR_TEXT} textId="tilbury-1588" />
          </EntryAirlock>
        )}

        {viewMode === 'LOGIC' && (
          <LogicBoard />
        )}

        {viewMode === 'STYLE' && (
          <div className="h-full w-full bg-[#f8fafc] overflow-y-auto">
            <StyleDojo />
          </div>
        )}
      </main>

      {/* The Thinking Sidebar - Always visible */}
      <Sidebar />
    </div>
  );
}

export default App;

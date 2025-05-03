-- Mock data for 'learning_technics' table
INSERT INTO learning_technics (id, name, short_desc, detailed_desc, created_at, updated_at, how_to_use)
VALUES 
(1, 'Pomodoro Technique', 'Time management method', 'Work for 25 minutes, then take a 5-minute break. Repeat. After 4 cycles, take a longer 15-30 minute break. Use any timer.', '2023-01-15 08:30:00', '2023-01-15 08:30:00', 'Step 1: Choose a task you want to work on. Step 2: Set a timer for 25 minutes. Step 3: Work on your task with complete focus until the timer rings. Step 4: Take a 5-minute break (stretch, get water, etc.). Step 5: Repeat steps 2-4 three more times. Step 6: After the fourth cycle, take a longer break (15-30 minutes). Tip: Use a simple kitchen timer or a Pomodoro app on your phone. Start with just one Pomodoro if you are new to this technique.'),
(2, 'Active Recall', 'Self-testing method', 'Retrieve information from memory without cues. Simply try to recall what you learned without looking at the material, then check for accuracy.', '2023-02-20 10:15:00', '2023-02-20 10:15:00', 'Step 1: Study your material as usual. Step 2: Close your notes/book. Step 3: On a blank piece of paper, write down everything you remember about the topic. Step 4: Open your notes and check what you got right and what you missed. Step 5: Focus extra review time on the information you could not recall. Tip: Start with small sections of material. You can use flashcards to practice active recall in short bursts throughout the day.'),
(3, 'Spaced Repetition', 'Smart review timing', 'Review information just before you forget it. Use apps like Anki or physical flashcards. First review 1 day later, then 3 days, then 1 week, etc.', '2023-03-05 14:45:00', '2023-03-10 09:20:00', 'Step 1: Create flashcards with questions on one side and answers on the other. Step 2: Review the cards on day 1. Step 3: Sort cards into 3 piles based on difficulty (easy, medium, hard). Step 4: Review hard cards the next day, medium cards after 3 days, and easy cards after a week. Step 5: Repeat the process, extending the time between reviews for cards you know well. Tip: Use the free app Anki which automatically schedules reviews for you based on how well you knew each card.'),
(4, 'Blurting Method', 'Quick self-testing', '1) Read a topic 2) Close materials 3) Write down everything you remember 4) Check accuracy. Repeat gaps.', '2023-04-12 11:30:00', '2023-04-18 16:10:00', 'Step 1: Read a page or section of your study material carefully. Step 2: Close the book or put away your notes. Step 3: Take a blank piece of paper and "blurt out" everything you can remember by writing it down quickly. Step 4: Open your materials and compare what you wrote to the original text. Step 5: Highlight any information you missed or got wrong. Step 6: Review those specific points and repeat the process. Tip: Use different colored pens for each "blurting" session to track your improvement.'),
(5, 'Highlight & Revisit', 'Selective focusing', 'Highlight/keyword only 1-2 crucial concepts per paragraph. Later, cover content and explain using just your highlights.', '2023-05-22 13:20:00', '2023-05-22 13:20:00', 'Step 1: Read a paragraph completely first without marking anything. Step 2: Identify the 1-2 most important concepts or keywords in that paragraph. Step 3: Highlight ONLY those few words (not entire sentences). Step 4: Continue for the whole text. Step 5: Later, cover the text and look only at your highlights. Step 6: Try to explain the full concept from each highlighted term. Tip: Use sticky notes or a separate notebook to write expanded explanations of each highlight to test your understanding.'),
(6, 'Two Column Notes', 'Active organization', 'While reading, write main topics in left column. After reading, summarize key points in your own words in right column.', '2023-06-30 09:00:00', '2023-07-05 14:30:00', 'Step 1: Divide your paper into two columns (about 1/3 width for left column, 2/3 for right). Step 2: As you read, write main topics, questions, or keywords in the left column. Step 3: In the right column, write detailed notes, definitions, and explanations that correspond to each left-column item. Step 4: After finishing a section, cover the right column. Step 5: Look at each keyword in the left column and try to recall the information. Step 6: Uncover the right column to check your accuracy. Tip: Leave space at the bottom of each page to write a brief summary connecting all the concepts.');

-- Mock data for 'notes' table
INSERT INTO notes (id, title, content, user_id, learning_technic_id, created_at, updated_at)
VALUES 
(1, 'Pomodoro Basics', 'Pomodoro helps with focus and productivity.', 1, 1, '2023-01-16 09:45:00', '2023-01-16 09:45:00'),
(2, 'Mind Mapping for Exams', 'Use mind maps to summarize chapters.', 2, 2, '2023-02-21 11:30:00', '2023-02-25 15:20:00'),
(3, 'Spaced Repetition Apps', 'Anki is a great tool for spaced repetition.', 3, 3, '2023-03-06 16:10:00', '2023-03-12 10:45:00'),
(4, 'Active Recall Tips', 'Use flashcards to practice active recall.', 4, 4, '2023-04-13 14:00:00', '2023-04-20 08:30:00'),
(5, 'Feynman Technique Example', 'Explain Newton s laws to a friend', 5, 5, '2023-05-23 10:15:00', '2023-05-30 13:45:00'),
(6, 'SQ3R for Textbooks', 'Apply SQ3R to dense textbook chapters.', 6, 6, '2023-07-01 08:00:00', '2023-07-08 11:20:00'),
(7, 'Cornell Notes Template', 'Use a Cornell Notes template for lectures.', 7, 7, '2023-01-18 13:30:00', '2023-01-25 09:10:00'),
(8, 'Interleaved Practice Benefits', 'Mix math and physics problems in one session.', 8, 8, '2023-02-22 15:45:00', '2023-03-01 14:30:00'),
(9, 'Elaboration in Essays', 'Add detailed examples to your essays.', 9, 9, '2023-03-08 10:20:00', '2023-03-15 16:00:00'),
(10, 'Visualization for Anatomy', 'Visualize body parts to learn anatomy.', 10, 10, '2023-04-15 11:10:00', '2023-04-22 10:15:00'),
(11, 'Chunking for Numbers', 'Group phone numbers into chunks for easy recall.', 1, 11, '2023-05-24 14:30:00', '2023-05-31 12:45:00'),
(12, 'Dual Coding for Biology', 'Combine diagrams and text to learn cell structures.', 2, 12, '2023-07-02 09:45:00', '2023-07-09 15:30:00'),
(13, 'Retrieval Practice for History', 'Quiz yourself on historical events.', 3, 13, '2023-01-20 08:15:00', '2023-01-27 11:40:00'),
(14, 'Self-Explanation for Math', 'Explain math problems step by step.', 4, 14, '2023-02-24 10:30:00', '2023-03-03 14:20:00'),
(15, 'Distributed Practice for Languages', 'Spread vocabulary learning over weeks.', 5, 15, '2023-03-10 13:45:00', '2023-03-17 09:30:00'),
(16, 'Metacognition in Learning', 'Reflect on what study methods work best for you.', 6, 16, '2023-04-17 15:00:00', '2023-04-24 08:45:00'),
(17, 'Mnemonics for Chemistry', 'Use acronyms to remember the periodic table.', 7, 17, '2023-05-25 11:20:00', '2023-06-01 16:30:00'),
(18, 'Overlearning for Piano', 'Practice scales even after mastering them.', 8, 18, '2023-07-03 14:10:00', '2023-07-10 10:20:00'),
(19, 'Deliberate Practice for Coding', 'Focus on solving specific algorithm problems.', 9, 19, '2023-01-22 09:30:00', '2023-01-29 13:15:00'),
(20, 'Gamification in Education', 'Use apps like Duolingo to make learning fun.', 10, 20, '2023-02-26 12:45:00', '2023-03-05 15:40:00');

-- Mock data for 'tags' table
INSERT INTO tags (id, name, created_at, updated_at)
VALUES 
(1, 'Productivity', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(2, 'Memory', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(3, 'Focus', '2023-01-10 08:00:00', '2023-01-15 09:30:00'),
(4, 'Learning', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(5, 'Time Management', '2023-01-10 08:00:00', '2023-01-18 11:20:00'),
(6, 'Organization', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(7, 'Study Tips', '2023-01-10 08:00:00', '2023-01-22 14:15:00'),
(8, 'Visualization', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(9, 'Retention', '2023-01-10 08:00:00', '2023-01-25 10:45:00'),
(10, 'Comprehension', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(11, 'Creativity', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(12, 'Problem Solving', '2023-01-10 08:00:00', '2023-01-30 13:20:00'),
(13, 'Critical Thinking', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(14, 'Collaboration', '2023-01-10 08:00:00', '2023-02-05 09:10:00'),
(15, 'Motivation', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(16, 'Discipline', '2023-01-10 08:00:00', '2023-02-10 11:30:00'),
(17, 'Efficiency', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(18, 'Innovation', '2023-01-10 08:00:00', '2023-02-15 14:45:00'),
(19, 'Engagement', '2023-01-10 08:00:00', '2023-01-10 08:00:00'),
(20, 'Wellness', '2023-01-10 08:00:00', '2023-02-20 16:00:00');

-- Mock data for 'tag_notes' table
INSERT INTO tag_notes (id, tag_id, note_id, created_at, updated_at)
VALUES 
(1, 1, 1, '2023-01-16 10:00:00', '2023-01-16 10:00:00'),
(2, 2, 3, '2023-03-06 16:30:00', '2023-03-06 16:30:00'),
(3, 3, 1, '2023-01-16 10:05:00', '2023-01-16 10:05:00'),
(4, 4, 2, '2023-02-21 12:00:00', '2023-02-21 12:00:00'),
(5, 5, 1, '2023-01-16 10:10:00', '2023-01-16 10:10:00'),
(6, 6, 7, '2023-01-18 14:00:00', '2023-01-18 14:00:00'),
(7, 7, 4, '2023-04-13 14:30:00', '2023-04-13 14:30:00'),
(8, 8, 10, '2023-04-15 11:30:00', '2023-04-15 11:30:00'),
(9, 9, 3, '2023-03-06 17:00:00', '2023-03-06 17:00:00'),
(10, 10, 6, '2023-07-01 08:30:00', '2023-07-01 08:30:00'),
(11, 11, 11, '2023-05-24 15:00:00', '2023-05-24 15:00:00'),
(12, 12, 12, '2023-07-02 10:15:00', '2023-07-02 10:15:00'),
(13, 13, 13, '2023-01-20 08:45:00', '2023-01-20 08:45:00'),
(14, 14, 14, '2023-02-24 11:00:00', '2023-02-24 11:00:00'),
(15, 15, 15, '2023-03-10 14:15:00', '2023-03-10 14:15:00'),
(16, 16, 16, '2023-04-17 15:30:00', '2023-04-17 15:30:00'),
(17, 17, 17, '2023-05-25 11:45:00', '2023-05-25 11:45:00'),
(18, 18, 18, '2023-07-03 14:40:00', '2023-07-03 14:40:00'),
(19, 19, 19, '2023-01-22 10:00:00', '2023-01-22 10:00:00'),
(20, 20, 20, '2023-02-26 13:15:00', '2023-02-26 13:15:00');

-- Mock data for 'tips' table
INSERT INTO tips (id, tip, created_at, updated_at)
VALUES 
(1, 'Break tasks into smaller chunks.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(2, 'Use a timer to stay focused.', '2023-01-05 09:00:00', '2023-01-12 10:30:00'),
(3, 'Review notes regularly.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(4, 'Create a dedicated study space.', '2023-01-05 09:00:00', '2023-01-19 11:45:00'),
(5, 'Avoid multitasking.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(6, 'Take regular breaks.', '2023-01-05 09:00:00', '2023-01-22 14:20:00'),
(7, 'Use color coding for notes.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(8, 'Practice active recall daily.', '2023-01-05 09:00:00', '2023-01-25 15:10:00'),
(9, 'Teach someone else what you learned.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(10, 'Set specific goals for each study session.', '2023-01-05 09:00:00', '2023-01-30 16:30:00'),
(11, 'Use flashcards for quick reviews.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(12, 'Organize notes by topic.', '2023-01-05 09:00:00', '2023-02-05 10:15:00'),
(13, 'Use diagrams to visualize concepts.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(14, 'Plan study sessions in advance.', '2023-01-05 09:00:00', '2023-02-10 11:40:00'),
(15, 'Stay hydrated and take care of your health.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(16, 'Experiment with different study techniques.', '2023-01-05 09:00:00', '2023-02-15 13:20:00'),
(17, 'Limit distractions while studying.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(18, 'Set a consistent study schedule.', '2023-01-05 09:00:00', '2023-02-20 14:50:00'),
(19, 'Reward yourself after completing tasks.', '2023-01-05 09:00:00', '2023-01-05 09:00:00'),
(20, 'Track your progress to stay motivated.', '2023-01-05 09:00:00', '2023-02-25 16:00:00');
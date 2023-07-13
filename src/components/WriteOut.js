import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const WriteOut = () => {
    const [duration, setDuration] = useState(30);
    const [iterations, setIterations] = useState(2);
    const [text, setText] = useState('');
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [sentences, setSentences] = useState([]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isRunning && timeLeft === 0 && iterations > 1) {
            // Start the next iteration
            setTimeout(() => {
                setSentences([...sentences, text]);
                setWordCount(wordCount + countWords());
                setText('');
                setTimeLeft(duration);
                setIterations(iterations - 1);
            }, 10000); // Wait for 10 seconds before starting the next iteration
        } else if (isRunning && timeLeft === 0 && iterations === 1) {
            // Game ended, show word count and stop the timer
            setIsRunning(false);
            setWordCount(countWords());
            setSentences([...sentences, text]);
            showWordCountPopup();
        }
    }, [isRunning, timeLeft, iterations]);

    

    const countWords = () => {
        const words = text.trim().split(/\s+/);
        return words.length;
    };

    const showWordCountPopup = () => {
        alert(`Total words written: ${wordCount}`);
        document.getElementById('container').scrollIntoView({ behavior: 'smooth' });
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        setWordCount(countWords());
    };

    const handleReset = () => {
        setIsRunning(false);
        setText('');
        setTimeLeft(duration);
        setWordCount(0);
        setSentences([]);
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('container');
        html2pdf()
            .from(element)
            .save('text.pdf');
    };

    return (
        <div style={{ justifyContent: 'center', maxWidth: '70%', alignItems: 'center' }}>
            <h1>Get your thoughts out!</h1>
            <h5> Write anything down. Your writing will be saved for the end. Ready?</h5>
            <div>
                <label><b>Duration:</b></label>
                <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style = {{padding: '5px', margin: '10px'}}
                >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                </select>
            </div>
            <div>
                <label><b>Iterations:</b></label>
                <input
                    type="number"
                    min={1}
                    max={10}
                    value={iterations}
                    onChange={(e) => setIterations(Number(e.target.value))}
                />
            </div>
            <div>
                {!isRunning ? (
                    <button onClick={handleStart} style={{ margin:'20px'}}>Start</button>
                ) : (
                    <button onClick={handleStop} style={{ margin:'20px'}}>Stop</button>
                )}
                <button onClick={handleReset} style={{ margin:'20px'}}>Reset</button>
            </div>
            <div>
                <textarea
                    rows={10}
                    cols={50}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    readOnly={!isRunning}
                />
            </div>
            {/* <div>
                <button onClick={handleDownloadPDF}>Download as PDF</button>
            </div>` */}
            {sentences.length > 0 && (
                <div className="container" id="container" style={{ width: '98%', marginTop: '50px' }}>
                    <h3>Keep up your wonderful writing! Save it in a Google/Word doc</h3>
                    
                    {sentences.map((sentence, index) => (
                        <div key={index}>
                            <h5>{`Writing from iteration ${index+1}:`}</h5>
                            {sentence}
                            <br /><br />
                        </div>
                    ))}
                    
                </div>
            )}

        </div>
    );
};

export default WriteOut;

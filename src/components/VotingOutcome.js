import React, { useState } from 'react';

import '../styles/VotingOutcome.scss';


function VotingOutcome(props) {
    const [tokens, setTokens] = useState([
        { side: '', token: '', alignment: '' },
    ]);

    const add = () => {
        setTokens([...tokens, { side: '', token: '', alignment: '' }]);
    }


    const handleChange = (e) => {
        const updatedTokens = [...tokens];
        updatedTokens[e.target.dataset.idx][e.target.className] = e.target.value;
        setTokens(updatedTokens);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(tokens);
    }


    return (
        props.isVisible &&
        <form className="voting-token-form" onSubmit={onSubmit}>
            <input
                type="button"
                value="Assign Token"
                onClick={add}
            />
            {
                tokens.map((val, idx) => {
                    const side = `side-${idx}`;
                    const token = `token-${idx}`;
                    const alignment = `alignment-${idx}`;
                    return (
                        <div className="assign-outcome" key={`tokens-${idx}`}>
                            <label htmlFor={side + '-aye'}>Aye</label>
                            <input
                                type="radio"
                                name={side}
                                data-idx={idx}
                                id={side + "-aye"}
                                className="side"
                                value="aye"
                                onChange={handleChange}
                                checked={tokens[idx].side === "aye"}
                            />
                            <label htmlFor={side + '-nay'}>Nay</label>
                            <input
                                type="radio"
                                name={side}
                                data-idx={idx}
                                id={side + "-nay"}
                                className="side"
                                value="nay"
                                onChange={handleChange}
                                checked={tokens[idx].side === "nay"}
                            />

                            <label htmlFor={token}>Select Token</label>
                            <input
                                name={token}
                                data-idx={idx}
                                id={token}
                                className="token"
                                list="tokens-options"
                                value={tokens[idx].token}
                                onChange={handleChange}
                            />

                            <datalist id="tokens-options">
                                <option value="influence" />
                                <option value="morale" />
                                <option value="knowledge" />
                                <option value="welfare" />
                                <option value="wealth" />
                                <option value="chronicle" />
                            </datalist>
                            <input
                                type="radio"
                                name={alignment}
                                data-idx={idx}
                                id={alignment + "-pos"}
                                className="alignment"
                                value="pos"
                                onChange={handleChange}
                                checked={tokens[idx].alignment === "pos"}
                            />
                            <label htmlFor={alignment + '-pos'}>Positive</label>
                            <input
                                type="radio"
                                name={alignment}
                                data-idx={idx}
                                id={alignment + "-neg"}
                                className="alignment"
                                value="neg"
                                onChange={handleChange}
                                checked={tokens[idx].alignment === "neg"}
                            />
                            <label htmlFor={alignment + '-neg'}>Negative</label>
                        </div>
                    )
                })
            }
            <input type="submit" value="Submit" />
        </form>
    );
}

export default VotingOutcome;
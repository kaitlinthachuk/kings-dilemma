import React, { useState } from 'react';

import '../styles/AgendaModal.scss';


function AgendaModal(props) {
    const [tokens, setTokens] = useState([
        { house: '', token: '', alignment: '' },
    ]);

    const add = () => {
        setTokens([...tokens, { house: '', token: '', alignment: '' }]);
    }


    const handleChange = (e) => {
        const updatedTokens = [...tokens];
        updatedTokens[e.target.dataset.idx][e.target.className] = e.target.value.toLowerCase();
        setTokens(updatedTokens);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(tokens);
    }
    return (
        props.isVisible &&
        <form className="agenda-token-form" onSubmit={onSubmit}>
            <input
                type="button"
                value="Assign Token"
                onClick={add}
            />

            {
                tokens.map((val, idx) => {
                    const house = `house-${idx}`;
                    const token = `token-${idx}`;
                    const alignment = `alignment-${idx}`;
                    return (
                        <div className="assign-agenda" key={`tokens-${idx}`}>
                            <label htmlFor={house}>Select House</label>
                            <input
                                name={house}
                                data-idx={idx}
                                id={house}
                                className="house"
                                list="houses"
                                value={tokens[idx].house}
                                onChange={handleChange}
                            />

                            <datalist id="houses">
                                <option value="Coden" />
                                <option value="Crann" />
                                <option value="Solad" />
                                <option value="Tiryll" />
                                <option value="Tork" />
                            </datalist>
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
                                <option value="Influence" />
                                <option value="Morale" />
                                <option value="Knowledge" />
                                <option value="Welfare" />
                                <option value="Wealth" />
                            </datalist>
                            <input
                                type="radio"
                                name={alignment}
                                data-idx={idx}
                                id={alignment + "-pos"}
                                className="alignment"
                                value="positive"
                                onChange={handleChange}
                            />
                            <label htmlFor={alignment + '-pos'}>Positive</label>
                            <input
                                type="radio"
                                name={alignment}
                                data-idx={idx}
                                id={alignment + "-neg"}
                                className="alignment"
                                value="negative"
                                onChange={handleChange}
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

export default AgendaModal;
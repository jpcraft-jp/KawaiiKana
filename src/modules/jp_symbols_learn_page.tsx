import "./css/jp_symbols_learn.css"
import KANA_DATA from "./helpers/DataTables"


export default function Jp_Symbol_Learn_Page() {
    const levels = Array.from({ length: KANA_DATA.length }, (_, i) => `level${i+1}`);
    return (
        <>
            <div className="page-body">
                <h1>Select A Level</h1>
                <div className="levels-body-box">
                    {levels.map((i)=> (
                        <div key={i} className="level-box">{i}</div>
                    ))}
                </div>    
            </div>
        </>
    )
}
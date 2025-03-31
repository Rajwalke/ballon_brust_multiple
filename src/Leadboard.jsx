import { useSelector } from "react-redux";

const Leadboard=()=>{

    const AllUser=useSelector((store)=>store.userInfoSlice[0]);
    // console.log();
    return (
        <div>
            <h1>LeadBoard </h1>
            <div>
                <table>
                    
                        
                                <th>Rank </th>
                        
                                <th>Name</th>
                   
                                <th>Score</th>
                        

                    {/* {
                        AllUser &&
                        AllUser.map((row)=>{
                            (
                                <tr>
                                    <td>{row}</td>
                                    <td>{row.fullName}</td>
                                    <td>{row.score}</td>
                                </tr>
                            )
                        })
                    } */}
{AllUser &&
                    <tr>
                        <td>{AllUser?.id}</td>
                        <td>{AllUser.firstName}</td>
                        <td>{AllUser.score}</td>
                    </tr>
}
                </table>
            </div>
        </div>
    )
}
export default Leadboard;
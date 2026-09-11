cmake_minimum_required(VERSION 3.29)
project(L12_C__)

set(CMAKE_CXX_STANDARD 20)



add_executable(server server.cpp)
add_executable(client client.cpp)
add_executable(clientUDP clientUDP.cpp)
add_executable(serverUDP serverUDP.cpp)
target_link_libraries(server ws2_32)
target_link_libraries(client ws2_32)
target_link_libraries(clientUDP ws2_32)
target_link_libraries(serverUDP ws2_32)
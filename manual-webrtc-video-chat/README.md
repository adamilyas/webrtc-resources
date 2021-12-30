# Manual WebRTC

Based on
- https://www.youtube.com/watch?v=h2WkZ0h0-Rc (Part 1)
- https://www.youtube.com/watch?v=UMy6vV4tW00 (Part 2)

# Sequence

A: offers and produces `sdp1`
B: set `sdp1` as remote desc
B: answers and produces `sdp2`
A: set `sdp2` as remote desc

A: Add B as ice candidate OR B: Add A as ice candidate
